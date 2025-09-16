/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI, GeneratedImage, PersonGeneration, Modality} from '@google/genai';

// API key is sourced from environment variables
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// --- DOM ELEMENTS ---
const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const negativePromptInput = document.getElementById('negative-prompt-input') as HTMLTextAreaElement;
const imageCountInput = document.getElementById('image-count-input') as HTMLInputElement;
const personGenerationSelect = document.getElementById('person-generation-select') as HTMLSelectElement;
const generateButton = document.getElementById('generate-button') as HTMLButtonElement;
const imageGallery = document.getElementById('image-gallery') as HTMLDivElement;
const loadingIndicator = document.getElementById('loading') as HTMLDivElement;
const loadingMessage = document.getElementById('loading-message') as HTMLParagraphElement;
const genderSelect = document.getElementById('gender-select') as HTMLSelectElement;
const tattoosSelect = document.getElementById('tattoos-select') as HTMLSelectElement;
const glassesSelect = document.getElementById('glasses-select') as HTMLSelectElement;
const hatSelect = document.getElementById('hat-select') as HTMLSelectElement;
const backgroundSelect = document.getElementById('background-select') as HTMLSelectElement;
const aspectRatioSelect = document.getElementById('aspect-ratio-select') as HTMLSelectElement;
const shotTypeSelect = document.getElementById('shot-type-select') as HTMLSelectElement;
const faceVisibilitySelect = document.getElementById('face-visibility-select') as HTMLSelectElement;
const logoInput = document.getElementById('logo-input') as HTMLInputElement;
const garmentTypeSelect = document.getElementById('garment-type-select') as HTMLSelectElement;
const garmentStyleSelect = document.getElementById('garment-style-select') as HTMLSelectElement;
const angleSelect = document.getElementById('angle-select') as HTMLSelectElement;


// --- MODEL SELECTION ---
const generationModel = 'imagen-4.0-generate-001';
const editingModel = 'gemini-2.5-flash-image-preview';

// --- GARMENT DATA ---
const garmentStyles: Record<string, string[]> = {
    'T-Shirt': ['Comfort Colors 1717', 'Bella+Canvas 3001', 'Gildan 5000'],
    'Hoodie': ['Gildan 18500', 'Lane Seven LS14001'],
};

// --- INITIAL PROMPT ---
promptInput.value = 'western style';

// --- EVENT LISTENERS ---
generateButton.addEventListener('click', generateFinalImages);
garmentTypeSelect.addEventListener('change', updateGarmentStyles);

function updateGarmentStyles() {
    const selectedType = garmentTypeSelect.value;
    const styles = garmentStyles[selectedType] || [];
    
    // Clear current options
    garmentStyleSelect.innerHTML = '';

    // Populate new options
    styles.forEach(style => {
        const option = document.createElement('option');
        option.value = style;
        option.textContent = style;
        garmentStyleSelect.appendChild(option);
    });
}


async function generateFinalImages() {
  const basePrompt = buildMainPrompt();
  if (!basePrompt) {
    alert('Please enter a prompt.');
    return;
  }

  setLoading(true, 'Preparing for generation...');

  // 1. Read logo file if it exists
  const logoFile = logoInput.files?.[0];
  let logoData: {data: string; mimeType: string} | null = null;
  if (logoFile) {
    try {
      logoData = await readFileAsBase64(logoFile);
    } catch (error) {
      console.error("Error reading logo file:", error);
      displayError('Error: Could not read the selected logo file.');
      setLoading(false);
      return;
    }
  }

  try {
    // 2. Generate the base images
    updateLoadingMessage('Step 1/2: Generating base mockup images...');
    const baseImages = await generateBaseImages(basePrompt, !logoData);

    if (!baseImages || baseImages.length === 0) {
        displayError('No base images were generated. The prompt may have been filtered.');
        setLoading(false);
        return;
    }

    // 3. If a logo was provided, apply it to each image
    if (logoData) {
      updateLoadingMessage('Step 2/2: Applying logo to images...');
      const garmentType = garmentTypeSelect.value;
      const editPromises = baseImages.map(baseImage => 
        applyLogoToImage(baseImage, logoData!, garmentType)
      );
      const finalImages = await Promise.all(editPromises);
      displayImages(finalImages, basePrompt);
    } else {
      displayImages(baseImages, basePrompt); // Display base images directly
    }

  } catch (error) {
    console.error("Error during image generation process:", error);
    displayError('Error: Could not generate images. Check the console for details.');
  } finally {
    setLoading(false);
  }
}

function buildMainPrompt(): string {
    const additionalDetails = promptInput.value.trim();
    const gender = genderSelect.value;
    const garmentType = garmentTypeSelect.value;
    const garmentStyle = garmentStyleSelect.value;
    
    let corePrompt = `Mockup photo of a ${gender === 'any' ? 'person' : gender + ' model'} wearing a solid black ${garmentStyle} ${garmentType}`;

    if (additionalDetails) {
        corePrompt += `, ${additionalDetails}`;
    }

    const promptParts: string[] = [corePrompt];

    const tattoos = tattoosSelect.value;
    if (tattoos === 'yes') promptParts.push('with tattoos on their arm');
    if (tattoos === 'no') promptParts.push('with no tattoos');

    const glasses = glassesSelect.value;
    if (glasses === 'yes') promptParts.push('wearing glasses');
    if (glasses === 'no') promptParts.push('not wearing glasses');
    
    const hat = hatSelect.value;
    if (hat === 'yes') promptParts.push('wearing a cowboy hat');
    if (hat === 'no') promptParts.push('not wearing a cowboy hat');
    
    const shotType = shotTypeSelect.value;
    if (shotType === 'close-up') promptParts.push('close-up shot');
    if (shotType === 'full-body') promptParts.push('full body shot');

    const faceVisibility = faceVisibilitySelect.value;
    if (faceVisibility === 'visible') promptParts.push('face is clearly visible');
    if (faceVisibility === 'hidden') promptParts.push('face is not visible');
    
    const angle = angleSelect.value;
    if (angle === 'front') promptParts.push('shot from the front');
    if (angle === 'back') promptParts.push('shot from the back');

    const background = backgroundSelect.value;
    if (background !== 'prompt') {
        promptParts.push(`the background is a ${background}`);
    }
    return promptParts.join(', ');
}

async function generateBaseImages(prompt: string, noLogo: boolean): Promise<GeneratedImage[]> {
    const finalPrompt = noLogo ? `${prompt}, no logo` : prompt;
    const negativePrompt = negativePromptInput.value.trim();
    const numberOfImages = parseInt(imageCountInput.value, 10);
    const personGeneration = personGenerationSelect.value as PersonGeneration;
    const aspectRatio = aspectRatioSelect.value;

    const config: any = {
      numberOfImages: numberOfImages,
      aspectRatio: aspectRatio,
      personGeneration: personGeneration,
      outputMimeType: 'image/jpeg',
    };

    if (negativePrompt) {
        config.negativePrompt = negativePrompt;
    }

    const response = await ai.models.generateImages({
      model: generationModel,
      prompt: finalPrompt,
      config: config,
    });
    
    return response.generatedImages || [];
}

async function applyLogoToImage(baseImage: GeneratedImage, logoData: {data: string, mimeType: string}, garmentType: string): Promise<GeneratedImage> {
    if (!baseImage.image?.imageBytes) return baseImage; // Return original if it has no data
    
    try {
        // Call the editing model to place the logo correctly
        const editResponse = await ai.models.generateContent({
            model: editingModel,
            contents: {
                parts: [
                    // Part 1: The base mockup image
                    { inlineData: { data: baseImage.image.imageBytes, mimeType: baseImage.image.mimeType || 'image/jpeg' } },
                    // Part 2: The logo image
                    { inlineData: { data: logoData.data, mimeType: logoData.mimeType } },
                    // Part 3: The instruction
                    { text: `Take the second image (the logo) and place it on the chest area of the ${garmentType.toLowerCase()} in the first image. It should be centered and sized realistically for a graphic print. Ensure the logo blends with the fabric's texture, folds, and lighting.` },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        // Extract the edited image from the response
        const editedImagePart = editResponse.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (editedImagePart?.inlineData) {
            return {
                image: {
                    imageBytes: editedImagePart.inlineData.data,
                    mimeType: editedImagePart.inlineData.mimeType,
                }
            };
        }
        return baseImage; // Fallback to base image if edit fails
    } catch (err) {
        console.error('Failed to apply logo to an image, returning original.', err);
        return baseImage; // Fallback to base image on error
    }
}


function setLoading(isLoading: boolean, message?: string) {
    if (isLoading) {
        generateButton.disabled = true;
        loadingIndicator.classList.remove('hidden');
        imageGallery.textContent = ''; // Clear previous content
        updateLoadingMessage(message || 'Processing...');
    } else {
        generateButton.disabled = false;
        loadingIndicator.classList.add('hidden');
    }
}

function updateLoadingMessage(message: string) {
    loadingMessage.textContent = message;
}

function displayImages(generatedImages: (GeneratedImage | null)[] | undefined, prompt: string) {
    imageGallery.textContent = ''; // Clear previous content
    if (generatedImages && generatedImages.length > 0) {
        generatedImages.forEach((generatedImage: GeneratedImage | null, index: number) => {
            if (generatedImage?.image?.imageBytes) {
                const mimeType = generatedImage.image.mimeType || 'image/jpeg';
                const src = `data:${mimeType};base64,${generatedImage.image.imageBytes}`;
                
                const container = document.createElement('div');
                container.className = 'image-container';

                const img = new Image();
                img.src = src;
                img.alt = `${prompt} - Image ${Number(index) + 1}`;
                
                const downloadLink = document.createElement('a');
                downloadLink.href = src;
                const extension = mimeType.split('/')[1] || 'jpeg';
                downloadLink.download = `imagen-mockup-${Date.now()}-${index + 1}.${extension}`;
                downloadLink.className = 'download-button';
                downloadLink.textContent = 'Download';
                
                container.appendChild(img);
                container.appendChild(downloadLink);
                imageGallery.appendChild(container);
            }
        });
    } else {
        displayError('No images were generated or available to display.');
    }
}

function displayError(message: string) {
    imageGallery.textContent = '';
    const errorParagraph = document.createElement('p');
    errorParagraph.textContent = message;
    imageGallery.appendChild(errorParagraph);
}

// --- HELPER FUNCTIONS ---

function readFileAsBase64(file: File): Promise<{data: string, mimeType: string}> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const parts = result.split(',');
            const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
            const data = parts[1];
            resolve({data, mimeType});
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Initial population of garment styles
updateGarmentStyles();