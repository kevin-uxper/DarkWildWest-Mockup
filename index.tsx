import { GoogleGenAI, Modality } from '@google/genai';
import { Modal, Collapse } from 'bootstrap';


// --- TRANSLATIONS ---
const translations = {
  en: {
    title: 'AI Mockup Generator',
    subtitle: 'Create free Mockups online for t-shirts, hoodies, stickers etc.',
    generateButton: 'Generate Images',
    joinButton: 'Join the discussion group',
    loadingMessage: 'Generating images, please wait...',
    alertError: 'An error occurred. Please try again.',
    alertErrorQuota: 'Quota exceeded. Please check your plan and billing details. This is not an application error.',
    alertErrorApiKey: 'Invalid API Key. Please ensure the API Key is configured correctly in the environment. This is not an application error.',
    mockupTypeTitle: 'Mockup Type',
    mockupTypeWithModel: 'With Model',
    mockupTypeGarmentOnly: 'Garment Only',
    characterDetailsTitle: 'Character Details',
    genderLabel: 'Gender',
    genderFemale: 'Female',
    genderMale: 'Male',
    ethnicityLabel: 'Ethnicity',
    ethnicityAny: 'Any',
    ethnicityCaucasian: 'Caucasian',
    ethnicityAsian: 'Asian',
    ethnicityAfricanAmerican: 'African American',
    ethnicityHispanic: 'Hispanic',
    hatLabel: 'Hat',
    hatAny: 'Any',
    hatNone: 'No hat',
    hatCowboy: 'Cowboy hat',
    hatBeanie: 'Beanie',
    hatBaseballCap: 'Baseball cap',
    glassesLabel: 'Glasses',
    glassesNone: 'No glasses',
    glassesClear: 'Clear glasses',
    glassesSun: 'Sunglasses',
    glassesColored: 'Colored glasses',
    garmentDetailsTitle: 'Garment Details',
    garmentStyleLabel: 'Garment Style',
    garmentColorLabel: 'Garment Color',
    colorBlack: 'Black',
    colorWhite: 'White',
    colorBay: 'Bay',
    colorBlossom: 'Blossom',
    colorChambray: 'Chambray',
    colorDenim: 'Denim',
    colorGraphite: 'Graphite',
    colorGrey: 'Grey',
    colorIvory: 'Ivory',
    colorKhaki: 'Khaki',
    garmentBrandLabel: 'Garment Brand',
    brandAny: 'Any',
    artworkDetailsTitle: 'Upload Artwork',
    logoLabel: 'Upload artwork',
    artworkTooltip: 'The design will be mocked up onto the model\'s shirt in the generated photo.',
    shotFramingTitle: 'Shot & Framing',
    shotTypeLabel: 'Shot Type',
    shotTypeFullBody: 'Full Body',
    shotTypeUpperBody: 'Upper Body',
    shotTypeCloseUp: 'Close-up',
    shotTypeMedium: 'Medium Shot (waist up)',
    shotTypeCowboy: 'Cowboy Shot (mid-thigh up)',
    shotTypeDutch: 'Dutch Angle',
    shotTypeLow: 'Low Angle',
    shotTypeHigh: 'High Angle',
    poseLabel: 'Pose',
    poseAny: 'Any',
    poseStandingStraight: 'Standing straight, looking forward',
    poseStandingSideways: 'Standing sideways',
    poseWalking: 'Walking towards camera',
    poseLeaning: 'Leaning against a wall',
    poseSitting: 'Sitting on a stool',
    poseHandsPockets: 'Hands in pockets',
    poseArmsCrossed: 'Arms crossed',
    backgroundTitle: 'Background',
    backgroundLabel: 'Describe the background',
    backgroundPlaceholder: 'e.g., outdoor urban setting, plain white background, beach at sunset...',
    imageSettingsTitle: 'Image Settings',
    aspectRatioLabel: 'Aspect Ratio',
    aspectRatioSquare: 'Square (1:1) - approx. 1536x1536px',
    aspectRatioPortrait: 'Portrait (3:4) - approx. 1152x1536px',
    aspectRatioLandscape: 'Landscape (4:3) - approx. 1536x1152px',
    aspectRatioWidescreen: 'Widescreen (16:9)',
    aspectRatioPortraitWide: 'Portrait Wide (9:16)',
    numImagesLabel: 'Number of images (1-4)',
    negativePromptLabel: 'Negative Prompt',
    negativePromptTooltip: 'Describe what you DON\'T want to see in the image.',
    policyTitle: 'Policy',
    personPolicyLabel: 'Person Generation Policy',
    personPolicyTooltip: 'I will not attempt to generate imagery of a real person, including myself.',
    finalPromptLabel: 'Final Prompt Sent to AI',
    footerText: 'Copyright 2025 by CreatorStack',
    languageAriaLabel: 'Language selection',
    downloadButton: 'Download',
    zoomImage: 'Zoom Image',
  },
  vi: {
    title: 'Trình tạo Mockup AI',
    subtitle: 'Tạo Mockup miễn phí cho áo thun, áo hoodie, nhãn dán, v.v.',
    generateButton: 'Tạo ảnh',
    joinButton: 'Tham gia nhóm thảo luận',
    loadingMessage: 'Đang tạo ảnh, vui lòng chờ...',
    alertError: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    alertErrorQuota: 'Đã vượt quá hạn ngạch. Vui lòng kiểm tra gói và chi tiết thanh toán của bạn. Đây không phải là lỗi của ứng dụng.',
    alertErrorApiKey: 'Khóa API không hợp lệ. Vui lòng đảm bảo khóa API được cấu hình chính xác trong môi trường. Đây không phải là lỗi ứng dụng.',
    mockupTypeTitle: 'Loại Mockup',
    mockupTypeWithModel: 'Có người mẫu',
    mockupTypeGarmentOnly: 'Chỉ áo',
    characterDetailsTitle: 'Chi tiết nhân vật',
    genderLabel: 'Giới tính',
    genderFemale: 'Nữ',
    genderMale: 'Nam',
    ethnicityLabel: 'Sắc tộc',
    ethnicityAny: 'Bất kỳ',
    ethnicityCaucasian: 'Da trắng',
    ethnicityAsian: 'Châu Á',
    ethnicityAfricanAmerican: 'Người Mỹ gốc Phi',
    ethnicityHispanic: 'Người gốc Tây Ban Nha',
    hatLabel: 'Mũ',
    hatAny: 'Bất kỳ',
    hatNone: 'Không đội mũ',
    hatCowboy: 'Mũ cao bồi',
    hatBeanie: 'Mũ len',
    hatBaseballCap: 'Mũ lưỡi trai',
    glassesLabel: 'Kính',
    glassesNone: 'Không đeo kính',
    glassesClear: 'Kính trong',
    glassesSun: 'Kính râm',
    glassesColored: 'Kính màu',
    garmentDetailsTitle: 'Chi tiết trang phục',
    garmentStyleLabel: 'Kiểu trang phục',
    garmentColorLabel: 'Màu sắc trang phục',
    colorBlack: 'Đen',
    colorWhite: 'Trắng',
    colorBay: 'Xanh Vịnh',
    colorBlossom: 'Hồng Phấn',
    colorChambray: 'Xanh Chambray',
    colorDenim: 'Jean',
    colorGraphite: 'Than Chì',
    colorGrey: 'Xám',
    colorIvory: 'Trắng Ngà',
    colorKhaki: 'Kaki',
    garmentBrandLabel: 'Thương hiệu trang phục',
    brandAny: 'Bất kỳ',
    artworkDetailsTitle: 'Tải lên Artwork',
    logoLabel: 'Tải lên artwork',
    artworkTooltip: 'Thiết kế sẽ được mockup vào áo của người mẫu trong ảnh được tạo ra.',
    shotFramingTitle: 'Góc chụp & Khung hình',
    shotTypeLabel: 'Loại ảnh chụp',
    shotTypeFullBody: 'Toàn thân',
    shotTypeUpperBody: 'Nửa thân trên',
    shotTypeCloseUp: 'Cận cảnh',
    shotTypeMedium: 'Ảnh trung bình (từ eo trở lên)',
    shotTypeCowboy: 'Ảnh Cowboy (từ giữa đùi trở lên)',
    shotTypeDutch: 'Góc nghiêng (Dutch Angle)',
    shotTypeLow: 'Góc thấp',
    shotTypeHigh: 'Góc cao',
    poseLabel: 'Tư thế',
    poseAny: 'Bất kỳ',
    poseStandingStraight: 'Đứng thẳng, nhìn về phía trước',
    poseStandingSideways: 'Đứng nghiêng',
    poseWalking: 'Đi về phía máy ảnh',
    poseLeaning: 'Dựa vào tường',
    poseSitting: 'Ngồi trên ghế đẩu',
    poseHandsPockets: 'Tay trong túi quần',
    poseArmsCrossed: 'Khoanh tay',
    backgroundTitle: 'Nền',
    backgroundLabel: 'Mô tả nền',
    backgroundPlaceholder: 'ví dụ: cảnh đô thị ngoài trời, nền trắng trơn, bãi biển lúc hoàng hôn...',
    imageSettingsTitle: 'Cài đặt hình ảnh',
    aspectRatioLabel: 'Tỷ lệ khung hình',
    aspectRatioSquare: 'Vuông (1:1) - khoảng 1536x1536px',
    aspectRatioPortrait: 'Dọc (3:4) - khoảng 1152x1536px',
    aspectRatioLandscape: 'Ngang (4:3) - khoảng 1536x1152px',
    aspectRatioWidescreen: 'Màn ảnh rộng (16:9)',
    aspectRatioPortraitWide: 'Chân dung rộng (9:16)',
    numImagesLabel: 'Số lượng ảnh (1-4)',
    negativePromptLabel: 'Prompt phủ định',
    negativePromptTooltip: 'Mô tả những gì bạn KHÔNG muốn thấy trong ảnh.',
    policyTitle: 'Chính sách',
    personPolicyLabel: 'Chính sách tạo hình ảnh người',
    personPolicyTooltip: 'Tôi sẽ không cố gắng tạo ra hình ảnh của một người thật, bao gồm cả chính tôi.',
    finalPromptLabel: 'Prompt cuối cùng được gửi đến AI',
    footerText: 'Bản quyền 2025 bởi CreatorStack',
    languageAriaLabel: 'Chọn ngôn ngữ',
    downloadButton: 'Tải xuống',
    zoomImage: 'Phóng to ảnh',
  },
};

let currentLang = 'en';

// --- DOM ELEMENTS ---
let languageSelector: HTMLSelectElement;
let mockupTypeModelRadio: HTMLInputElement;
let mockupTypeGarmentRadio: HTMLInputElement;
let characterDetailsButton: HTMLButtonElement;
let characterDetailsCollapse: Collapse;
let shotFramingButton: HTMLButtonElement;
let shotFramingCollapse: Collapse;
let genderSelect: HTMLSelectElement;
let ethnicitySelect: HTMLSelectElement;
let hatSelect: HTMLSelectElement;
let glassesSelect: HTMLSelectElement;
let garmentStyleSelect: HTMLSelectElement;
let garmentColorSelect: HTMLSelectElement;
let garmentBrandSelect: HTMLSelectElement;
let shotTypeSelect: HTMLSelectElement;
let poseSelect: HTMLSelectElement;
let aspectRatioSelect: HTMLSelectElement;
let numImagesInput: HTMLInputElement;
let negativePromptInput: HTMLInputElement;
let backgroundPromptInput: HTMLTextAreaElement;
let logoUpload: HTMLInputElement;
let logoPreviewContainer: HTMLElement;
let logoPreviewImg: HTMLImageElement;
let removeLogoButton: HTMLButtonElement;
let generateButton: HTMLButtonElement;
let regenerateButton: HTMLButtonElement;
let editPromptButton: HTMLButtonElement;
let gallery: HTMLElement;
let loadingIndicator: HTMLElement;
let finalPromptContainer: HTMLElement;
let finalPromptText: HTMLTextAreaElement;
let imageModal: Modal;


let logoFile: File | null = null;

// --- FUNCTIONS ---

function setLanguage(lang: string) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-translate-key]').forEach(elem => {
    const key = elem.getAttribute('data-translate-key') as keyof typeof translations.en;
    if (key && translations[lang as keyof typeof translations]?.[key]) {
      elem.innerHTML = translations[lang as keyof typeof translations][key]!;
    }
  });
  document.querySelectorAll('[data-translate-placeholder-key]').forEach(elem => {
    const key = elem.getAttribute('data-translate-placeholder-key') as keyof typeof translations.en;
    if (key && translations[lang as keyof typeof translations]?.[key]) {
        (elem as HTMLInputElement | HTMLTextAreaElement).placeholder = translations[lang as keyof typeof translations][key]!;
    }
  });
   document.querySelectorAll('[data-translate-aria-label-key]').forEach(elem => {
    const key = elem.getAttribute('data-translate-aria-label-key') as keyof typeof translations.en;
    if (key && translations[lang as keyof typeof translations]?.[key]) {
      elem.setAttribute('aria-label', translations[lang as keyof typeof translations][key]!);
    }
  });
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function setLoading(isLoading: boolean) {
  if (isLoading) {
    loadingIndicator.classList.remove('d-none');
    gallery.innerHTML = ''; // Clear previous images
    gallery.appendChild(loadingIndicator);
    generateButton.disabled = true;
    regenerateButton.disabled = true;
  } else {
    loadingIndicator.classList.add('d-none');
    generateButton.disabled = false;
    regenerateButton.disabled = false;
  }
}

function displayError(message: string) {
  gallery.innerHTML = ''; // Clear loading indicator
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-danger w-100';
  alertDiv.role = 'alert';
  alertDiv.textContent = message;
  gallery.appendChild(alertDiv);
}

function buildMainPrompt(): string {
  const garmentStyle = garmentStyleSelect.value;
  const garmentColor = garmentColorSelect.value;
  const garmentBrand = garmentBrandSelect.value === 'any' ? '' : `(${garmentBrandSelect.value} style)`;
  const background = backgroundPromptInput.value.trim() || 'plain white background';
  const negativePrompt = negativePromptInput.value.trim();

  let prompt = '';

  if (mockupTypeModelRadio.checked) {
    const gender = genderSelect.value;
    const ethnicity = ethnicitySelect.value === 'any' ? '' : ethnicitySelect.value;
    const hat = hatSelect.value === 'any' ? 'wearing a random hat or no hat' : `wearing a ${hatSelect.value}`;
    const glasses = glassesSelect.value;
    const shotType = shotTypeSelect.value;
    const pose = poseSelect.value === 'any' ? '' : `, ${poseSelect.value}`;
    prompt = `${shotType} photo of a ${ethnicity} ${gender} model wearing a plain ${garmentColor} ${garmentStyle} ${garmentBrand}, ${hat}, ${glasses}${pose}, on a ${background}, hyper-realistic, professional studio lighting`;
  } else {
    prompt = `product photo of a plain ${garmentColor} ${garmentStyle} ${garmentBrand}, laid flat on a ${background}, hyper-realistic, professional studio lighting`;
  }

  if (negativePrompt) {
    return `${prompt}, --no ${negativePrompt}`;
  }
  return prompt;
}

function showImageModal(imageUrl: string) {
    const modalImage = document.getElementById('modal-image') as HTMLImageElement;
    if (modalImage && imageModal) {
        modalImage.src = imageUrl;
        imageModal.show();
    }
}


function displayImages(images: { imageBytes: string }[], finalPrompt: string) {
  gallery.innerHTML = ''; // Clear loading indicator
  if (images.length === 0) {
      displayError(translations[currentLang as keyof typeof translations].alertError);
      return;
  }
  images.forEach(image => {
    const card = document.createElement('div');
    card.className = 'card';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const img = document.createElement('img');
    const imageUrl = `data:image/jpeg;base64,${image.imageBytes}`;
    img.src = imageUrl;
    img.className = 'card-img-top';
    img.alt = finalPrompt;

    const downloadButton = document.createElement('a');
    downloadButton.href = imageUrl;
    downloadButton.download = `mockup-${Date.now()}.jpg`;
    downloadButton.className = 'btn btn-success btn-sm download-button';
    downloadButton.textContent = translations[currentLang as keyof typeof translations].downloadButton;
    downloadButton.setAttribute('role', 'button');

    const zoomButton = document.createElement('button');
    zoomButton.className = 'btn btn-light btn-sm zoom-button';
    zoomButton.innerHTML = `<i class="bi bi-arrows-fullscreen"></i>`;
    zoomButton.setAttribute('aria-label', translations[currentLang as keyof typeof translations].zoomImage);
    zoomButton.onclick = () => showImageModal(imageUrl);


    imageContainer.appendChild(img);
    imageContainer.appendChild(downloadButton);
    imageContainer.appendChild(zoomButton);
    card.appendChild(imageContainer);
    gallery.appendChild(card);
  });
}

async function generateFinalImages() {
  setLoading(true);
  finalPromptContainer.classList.remove('d-none');
  
  let finalPrompt = '';
  // If the textarea has content (meaning it's a regeneration), use it. Otherwise, build a new prompt.
  if(finalPromptText.value.trim() !== '') {
    finalPrompt = finalPromptText.value.trim();
  } else {
    finalPrompt = buildMainPrompt();
    finalPromptText.value = finalPrompt;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: finalPrompt,
      config: {
        numberOfImages: parseInt(numImagesInput.value, 10),
        aspectRatio: aspectRatioSelect.value as "1:1" | "3:4" | "4:3" | "16:9" | "9:16",
        outputMimeType: 'image/jpeg',
      },
    });

    let finalImages = response.generatedImages;

    // If a logo is uploaded, apply it to each generated image
    if (logoFile && finalImages.length > 0) {
      const editedImages = [];
      for (const image of finalImages) {
        const logoBase64 = await arrayBufferToBase64(await logoFile.arrayBuffer());

        const editResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image-preview',
          contents: {
            parts: [
              { inlineData: { mimeType: 'image/jpeg', data: image.image.imageBytes } },
              { inlineData: { mimeType: logoFile.type, data: logoBase64 } },
              { text: 'Place the second image as a high-quality, realistic print on the center of the t-shirt in the first image.' },
            ],
          },
           config: {
              responseModalities: [Modality.IMAGE, Modality.TEXT],
          },
        });
        
        const imagePart = editResponse.candidates[0].content.parts.find(part => part.inlineData);
        if (imagePart && imagePart.inlineData) {
            editedImages.push({ imageBytes: imagePart.inlineData.data });
        }
      }
       // Replace original images with edited ones if any were successfully edited
      if (editedImages.length > 0) {
         finalImages = editedImages.map(img => ({ image: { imageBytes: img.imageBytes, mimeType: 'image/jpeg' } }));
      }
    }

    // FIX: The type of `imageBytes` on `img.image` is optional, but `displayImages` expects a required string.
    // We map to a new object to satisfy the type, and use a non-null assertion `!` because we expect `generateImages` to return image data on success.
    displayImages(finalImages.map(img => ({ imageBytes: img.image.imageBytes! })), finalPrompt);
  } catch (error: any) {
    console.error('Error generating images:', error);
    const errorMessage = error.toString();
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('exceeded your current quota')) {
        displayError(translations[currentLang as keyof typeof translations].alertErrorQuota);
    } else if (errorMessage.includes('API key not valid')) {
        displayError(translations[currentLang as keyof typeof translations].alertErrorApiKey);
    } else {
        displayError(translations[currentLang as keyof typeof translations].alertError);
    }
  } finally {
    setLoading(false);
    finalPromptText.readOnly = true;
    regenerateButton.classList.add('d-none');
  }
}

function updateControlsBasedOnMockupType() {
    const isGarmentOnly = mockupTypeGarmentRadio.checked;

    // Disable/Enable Character Details
    characterDetailsButton.disabled = isGarmentOnly;
    if (isGarmentOnly) {
        characterDetailsCollapse.hide();
        characterDetailsButton.parentElement?.parentElement?.classList.add('opacity-50');
    } else {
        characterDetailsButton.parentElement?.parentElement?.classList.remove('opacity-50');
    }

    // Disable/Enable Shot & Framing
    shotFramingButton.disabled = isGarmentOnly;
    if (isGarmentOnly) {
        shotFramingCollapse.hide();
        shotFramingButton.parentElement?.parentElement?.classList.add('opacity-50');
    } else {
        shotFramingButton.parentElement?.parentElement?.classList.remove('opacity-50');
    }
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    // Assign DOM elements
    languageSelector = document.getElementById('language-selector') as HTMLSelectElement;
    mockupTypeModelRadio = document.getElementById('mockup-type-model') as HTMLInputElement;
    mockupTypeGarmentRadio = document.getElementById('mockup-type-garment') as HTMLInputElement;
    characterDetailsButton = document.getElementById('character-details-button') as HTMLButtonElement;
    shotFramingButton = document.getElementById('shot-framing-button') as HTMLButtonElement;
    genderSelect = document.getElementById('gender-select') as HTMLSelectElement;
    ethnicitySelect = document.getElementById('ethnicity-select') as HTMLSelectElement;
    hatSelect = document.getElementById('hat-select') as HTMLSelectElement;
    glassesSelect = document.getElementById('glasses-select') as HTMLSelectElement;
    garmentStyleSelect = document.getElementById('garment-style-select') as HTMLSelectElement;
    garmentColorSelect = document.getElementById('garment-color-select') as HTMLSelectElement;
    garmentBrandSelect = document.getElementById('garment-brand-select') as HTMLSelectElement;
    shotTypeSelect = document.getElementById('shot-type-select') as HTMLSelectElement;
    poseSelect = document.getElementById('pose-select') as HTMLSelectElement;
    aspectRatioSelect = document.getElementById('aspect-ratio-select') as HTMLSelectElement;
    numImagesInput = document.getElementById('num-images-input') as HTMLInputElement;
    negativePromptInput = document.getElementById('negative-prompt-input') as HTMLInputElement;
    backgroundPromptInput = document.getElementById('background-prompt-input') as HTMLTextAreaElement;
    logoUpload = document.getElementById('logo-upload') as HTMLInputElement;
    logoPreviewContainer = document.getElementById('logo-preview-container') as HTMLElement;
    logoPreviewImg = document.getElementById('logo-preview-img') as HTMLImageElement;
    removeLogoButton = document.getElementById('remove-logo-button') as HTMLButtonElement;
    generateButton = document.getElementById('generate-button') as HTMLButtonElement;
    regenerateButton = document.getElementById('regenerate-button') as HTMLButtonElement;
    editPromptButton = document.getElementById('edit-prompt-button') as HTMLButtonElement;
    gallery = document.getElementById('gallery') as HTMLElement;
    loadingIndicator = document.getElementById('loading-indicator') as HTMLElement;
    finalPromptContainer = document.getElementById('final-prompt-container') as HTMLElement;
    finalPromptText = document.getElementById('final-prompt-text') as HTMLTextAreaElement;
    
    const imageModalEl = document.getElementById('image-modal');
    if (imageModalEl) {
        imageModal = new Modal(imageModalEl);
    }
    const characterDetailsCollapseEl = document.getElementById('collapseOne');
    if (characterDetailsCollapseEl) {
        characterDetailsCollapse = new Collapse(characterDetailsCollapseEl, { toggle: false });
    }
    const shotFramingCollapseEl = document.getElementById('collapseThree');
    if (shotFramingCollapseEl) {
        shotFramingCollapse = new Collapse(shotFramingCollapseEl, { toggle: false });
    }

    // --- INITIALIZATION ---
    const savedLang = localStorage.getItem('lang') || 'en';
    languageSelector.value = savedLang;
    setLanguage(savedLang);

    languageSelector.addEventListener('change', (e) => {
        setLanguage((e.target as HTMLSelectElement).value);
    });

    mockupTypeModelRadio.addEventListener('change', updateControlsBasedOnMockupType);
    mockupTypeGarmentRadio.addEventListener('change', updateControlsBasedOnMockupType);

    logoUpload.addEventListener('change', (event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files && files[0]) {
            logoFile = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                logoPreviewImg.src = e.target?.result as string;
                logoPreviewContainer.classList.remove('d-none');
            };
            reader.readAsDataURL(logoFile);
        }
    });

    removeLogoButton.addEventListener('click', () => {
        logoFile = null;
        logoUpload.value = ''; // Clear the file input
        logoPreviewContainer.classList.add('d-none');
        logoPreviewImg.src = '';
    });

    generateButton.addEventListener('click', () => {
        finalPromptText.value = ''; // Clear previous prompt before generating a new one
        generateFinalImages();
    });

    regenerateButton.addEventListener('click', generateFinalImages);

    editPromptButton.addEventListener('click', () => {
        finalPromptText.readOnly = false;
        finalPromptText.focus();
        regenerateButton.classList.remove('d-none');
    });
});