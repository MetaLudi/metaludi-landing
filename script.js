const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const pageLinks = document.querySelectorAll('a[href^="#"]');

function closeMobileMenu() {
  if (!siteNav || !menuButton) return;
  siteNav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}

function scrollToSection(targetId) {
  if (targetId === "#") return;

  const target = document.querySelector(targetId);
  if (!target) return;

  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

  window.scrollTo({
    top: targetTop,
    behavior: "smooth"
  });
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#" || !targetId.startsWith("#")) return;

    event.preventDefault();
    closeMobileMenu();
    scrollToSection(targetId);
  });
});

const heroImages = document.querySelectorAll(".hero-image");

heroImages.forEach((image) => {
  const updateImageState = () => {
    if (image.complete && image.naturalWidth > 0) {
      image.classList.remove("image-missing");
      return;
    }

    if (image.complete && image.naturalWidth === 0) {
      image.classList.add("image-missing");
    }
  };

  image.addEventListener("error", () => {
    image.classList.add("image-missing");
  });

  image.addEventListener("load", () => {
    image.classList.remove("image-missing");
  });

  updateImageState();
});


const snsServices = {
  blog: {
    title: "네이버 블로그",
    description: "블로그에서 MetaLudi의 활동 기록과 콘텐츠를 확인하세요.",
    url: "https://blog.naver.com/tiara1122",
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fblog.naver.com%2Ftiara1122",
    image: "images/blog_card.png",
    button: "네이버 블로그 바로가기"
  },
  instagram: {
    title: "인스타그램",
    description: "인스타그램에서 MetaLudi의 이미지와 소식을 확인하세요.",
    url: "https://www.instagram.com/metaludi.ai",
    qr: "",
    noQrText: "QR 이미지는 추후 준비됩니다",
    button: "인스타그램 바로가기"
  },
  youtube: {
    title: "유튜브",
    description: "추후 유튜브 채널 링크가 연결될 예정입니다.",
    url: "#",
    qr: "",
    noQrText: "채널 링크 준비중",
    button: "준비중"
  },
  clip: {
    title: "네이버 클립",
    description: "ClipPro에서 MetaLudi의 짧은 영상 콘텐츠를 확인하세요.",
    url: "https://clip.naver.com/@clippro",
    qr: "",
    noQrText: "QR 이미지는 추후 준비됩니다",
    button: "네이버 클립 바로가기"
  },
  kakao: {
    title: "카카오톡 문의",
    description: "톡톡루디 | MetaLudi 질문방으로 연결됩니다. PC에서 참여 버튼이 열리지 않으면 휴대폰 카카오톡으로 QR을 스캔하거나, 링크를 복사해 카카오톡에서 열어주세요.",
    url: "https://open.kakao.com/o/stVR36Bi",
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fopen.kakao.com%2Fo%2FstVR36Bi",
    button: "오픈채팅방 바로가기"
  },
  email: {
    title: "이메일 문의",
    description: "메일 앱이 열리며 바로 문의할 수 있습니다.",
    url: "tiara1122@naver.com",
    displayUrl: "tiara1122@naver.com",
    copyOnly: true,
    qr: "",
    noQrText: "아래 이메일 주소를 복사해 편한 메일 앱에서 보내주세요",
    button: "이메일 주소 복사하기"
  }
};

const snsModal = document.querySelector("#sns-modal");
const snsModalTitle = document.querySelector("#sns-modal-title");
const snsModalDescription = document.querySelector("#sns-modal-description");
const snsModalQr = document.querySelector("#sns-modal-qr");
const snsModalQrFallback = document.querySelector("#sns-modal-qr-fallback");
const snsModalMedia = document.querySelector("#sns-modal-media");
const snsModalImage = document.querySelector("#sns-modal-image");
const snsModalImageFallback = document.querySelector("#sns-modal-image-fallback");
const snsModalLink = document.querySelector("#sns-modal-link");
const snsModalAction = document.querySelector("#sns-modal-action");
const snsModalCopy = document.querySelector("#sns-modal-copy");
const snsModalHelp = document.querySelector("#sns-modal-help");
const snsButtons = document.querySelectorAll("[data-sns]");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");

function copyTextToClipboard(text) {
  if (!text || text === "#") return;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => {});
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

function setModalImageState(hasImage) {
  if (!snsModalMedia || !snsModalImage || !snsModalImageFallback) return;
  snsModalMedia.hidden = !hasImage;
  snsModalImage.classList.toggle("image-missing", !hasImage);
}

function setQrState(hasQr) {
  if (!snsModalQr || !snsModalQrFallback) return;
  snsModalQr.classList.toggle("is-hidden", !hasQr);
  snsModalQrFallback.classList.toggle("is-hidden", hasQr);
}

function openSnsModal(serviceKey) {
  const service = snsServices[serviceKey];
  if (!service || !snsModal) return;

  snsModalTitle.textContent = service.title;
  snsModalDescription.textContent = service.description;
  snsModalLink.textContent = service.displayUrl || (service.url === "#" ? "링크 준비중" : service.url);
  snsModalLink.href = service.copyOnly ? "#" : service.url;

  if (service.copyOnly) {
    snsModalLink.removeAttribute("target");
    snsModalLink.removeAttribute("rel");
    snsModalLink.onclick = (event) => {
      event.preventDefault();
      copyTextToClipboard(service.url);
      snsModalLink.textContent = service.displayUrl || service.url;
      snsModalAction.textContent = "이메일 주소가 복사되었습니다";
    };
  } else if (service.url === "#") {
    snsModalLink.removeAttribute("target");
    snsModalLink.removeAttribute("rel");
  } else {
    snsModalLink.onclick = null;
    snsModalLink.setAttribute("target", "_blank");
    snsModalLink.setAttribute("rel", "noopener noreferrer");
  }
  snsModalAction.textContent = service.button;
  snsModalAction.href = service.copyOnly ? "#" : service.url;

  if (snsModalCopy) {
    const shouldShowCopyButton = !service.copyOnly && (serviceKey === "kakao" || (service.url && service.url.startsWith("http")));
    snsModalCopy.hidden = !shouldShowCopyButton || service.url === "#";
    snsModalCopy.style.display = shouldShowCopyButton && service.url !== "#" ? "inline-flex" : "none";
    snsModalCopy.textContent = "링크 복사하기";
    snsModalCopy.onclick = () => {
      copyTextToClipboard(service.url);
      snsModalCopy.textContent = "링크가 복사되었습니다";
    };
  }

  if (snsModalHelp) {
    snsModalHelp.textContent = serviceKey === "kakao"
      ? "PC에서 참여 버튼이 바로 열리지 않을 때는 QR 스캔 또는 링크 복사를 이용하면 안정적으로 들어갈 수 있습니다."
      : "";
  }

  if (service.copyOnly) {
    snsModalAction.removeAttribute("target");
    snsModalAction.removeAttribute("rel");
    snsModalAction.onclick = (event) => {
      event.preventDefault();
      copyTextToClipboard(service.url);
      snsModalAction.textContent = "이메일 주소가 복사되었습니다";
    };
  } else {
    snsModalAction.onclick = null;
    snsModalAction.setAttribute("target", "_blank");
    snsModalAction.setAttribute("rel", "noopener noreferrer");
  }

  if (service.url === "#") {
    snsModalAction.onclick = null;
    snsModalAction.removeAttribute("target");
    snsModalAction.removeAttribute("rel");
  }

  if (service.image) {
    snsModalImage.src = service.image;
    snsModalImage.alt = service.title + " 소개 이미지";
    setModalImageState(true);
  } else {
    snsModalImage.removeAttribute("src");
    snsModalImage.alt = "";
    setModalImageState(false);
  }

  snsModal.classList.toggle("has-qr", !!service.qr);
  snsModal.classList.toggle("no-qr", !service.qr);

  if (service.qr) {
    snsModalQr.src = service.qr;
    snsModalQr.alt = service.title + " QR 코드";
    setQrState(true);
  } else {
    snsModalQr.removeAttribute("src");
    snsModalQr.alt = "";
    snsModalQrFallback.textContent = service.noQrText || "QR 이미지는 추후 준비됩니다";
    setQrState(false);
  }

  snsModal.classList.toggle("is-email-modal", service.copyOnly === true);
  snsModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeSnsModal() {
  if (!snsModal) return;
  snsModal.hidden = true;
  snsModal.classList.remove("is-email-modal");
  document.body.style.overflow = "";
}

snsButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openSnsModal(button.dataset.sns);
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeSnsModal);
});

if (snsModalQr) {
  snsModalQr.addEventListener("error", () => {
    snsModalQrFallback.textContent = "QR 이미지 준비중";
    setQrState(false);
  });

  snsModalQr.addEventListener("load", () => {
    setQrState(true);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && snsModal && !snsModal.hidden) {
    closeSnsModal();
  }
});


function openMailLink(mailHref) {
  if (!mailHref || !mailHref.startsWith("mailto:")) return;
  window.location.href = mailHref;
}

document.querySelectorAll('a[href^="mailto:"]').forEach((mailLink) => {
  mailLink.addEventListener("click", (event) => {
    event.preventDefault();
    openMailLink(mailLink.getAttribute("href"));
  });
});


document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const emailAddress = button.dataset.copyEmail;
    const originalText = button.textContent;
    copyTextToClipboard(emailAddress);
    button.textContent = "이메일 주소가 복사되었습니다";

    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1800);
  });
});


if (snsModalImage) {
  snsModalImage.addEventListener("error", () => {
    setModalImageState(true);
    snsModalImage.classList.add("image-missing");
  });

  snsModalImage.addEventListener("load", () => {
    snsModalImage.classList.remove("image-missing");
  });
}

document.querySelectorAll(".section-card-image").forEach((image) => {
  const updateCardImageState = () => {
    image.classList.toggle("image-missing", image.complete && image.naturalWidth === 0);
  };

  image.addEventListener("error", () => {
    image.classList.add("image-missing");
  });

  image.addEventListener("load", () => {
    image.classList.remove("image-missing");
  });

  updateCardImageState();
});

