/* --- 1. 변수 선언 --- */
const container = document.querySelector('.horizontal-container');
const originalSections = document.querySelectorAll('.section');

// 버튼 두 개 선택
const gridContainer = document.querySelector('.grid-view-container');
const btnOpen = document.querySelector('.view-toggle-btn');   // 버튼 1 (네모)
const btnClose = document.querySelector('.view-toggle-btn-2'); // 버튼 2 (동그라미)

const header = document.querySelector('header');
const menuTrigger = document.querySelector('.menu-trigger');

// [Clone 생성 로직]
const firstClone = originalSections[0].cloneNode(true);
const lastClone = originalSections[originalSections.length - 1].cloneNode(true);

container.appendChild(firstClone);
container.insertBefore(lastClone, container.firstChild);

const allSections = document.querySelectorAll('.section');
const totalSlides = allSections.length;

// 초기 설정
let currentIndex = 1;
let isAnimating = false;
let isGridView = false;

gsap.set(container, { xPercent: -100 * currentIndex });


/* ========================================================================
   ✨ [추가됨] 0. 페이지 로드 시 '이전 상태' 확인하여 복원하기
   뒤로 가기로 돌아왔을 때, 이전에 그리드 뷰를 보고 있었다면 바로 복원합니다.
======================================================================== */
if (sessionStorage.getItem('viewMode') === 'grid') {
    isGridView = true;

    // 1. 가로 슬라이드 숨기고 그리드 보이기 (애니메이션 없이 즉시 적용)
    gsap.set(container, { autoAlpha: 0 });
    gsap.set(gridContainer, { autoAlpha: 1 });

    // 2. 이름 이미지들도 제자리에 바로 배치 (떨어지는 애니메이션 없이 즉시 보임)
    gsap.set(".name-section img", { y: 0, opacity: 1 });
}


// --- 2. 휠 이벤트 ---
window.addEventListener('wheel', (e) => {
    if (isGridView || isAnimating) return;
    if (Math.abs(e.deltaY) < 30) return;

    if (header.classList.contains('active')) {
        closeMenu();
        return;
    }

    if (e.deltaY > 0) {
        gotoSection(currentIndex + 1);
    } else {
        gotoSection(currentIndex - 1);
    }
});


// --- 3. 슬라이드 이동 함수 ---
function gotoSection(index) {
    isAnimating = true;

    // 1. 이동할 다음 섹션과 이미지를 찾는다
    const nextSection = allSections[index];
    const nextImg = nextSection.querySelector('img');

    // 2. 이미지가 있다면, 캐릭터별로 등장 방향을 다르게 설정한다.
    if (nextImg) {

        // [변수 준비] 시작할 위치(x, y)를 저장할 변수 (기본값: 오른쪽에서 등장)
        let startProps = { x: "30vw", y: 0, opacity: 0 };

        // [설정] 캐릭터별로 조건문(if)을 걸어서 위치를 바꿈
        if (nextSection.classList.contains('monica')) {
            startProps = { x: "30vw", y: 0, opacity: 0 };
        }
        else if (nextSection.classList.contains('rachel')) {
            startProps = { x: "-30vw", y: 0, opacity: 0 };
        }
        else if (nextSection.classList.contains('phoebe')) {
            startProps = { x: 0, y: "-50vw", opacity: 0 };
        }
        else if (nextSection.classList.contains('ross')) {
            startProps = { x: "-30vw", y: 0, opacity: 0 };
        }
        else if (nextSection.classList.contains('joey')) {
            startProps = { x: 0, y: "30vw", opacity: 0 };
        }
        else if (nextSection.classList.contains('chandler')) {
            startProps = { x: "-30vw", y: 0, opacity: 0 };
        }

        // [애니메이션 실행]
        gsap.fromTo(nextImg,
            startProps,
            {
                x: 0,
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                delay: 0.3
            }
        );
    }

    // 3. 컨테이너 이동
    currentIndex = index;
    gsap.to(container, {
        xPercent: -100 * currentIndex,
        duration: 0.75,
        ease: "power2.inOut",
        onComplete: () => {
            isAnimating = false;
            checkLoop();
        }
    });
}

// --- 4. 무한 루프 처리 ---
function checkLoop() {
    if (currentIndex >= totalSlides - 1) {
        currentIndex = 1;
        gsap.set(container, { xPercent: -100 * currentIndex });
    }
    else if (currentIndex <= 0) {
        currentIndex = totalSlides - 2;
        gsap.set(container, { xPercent: -100 * currentIndex });
    }
}


// --- 5. [수정됨] 버튼 기능 설정 ---

// [버튼 1] 토글 기능
btnOpen.addEventListener('click', () => {

    if (!isGridView) {
        // [CASE 1] 열기
        isGridView = true;
        sessionStorage.setItem('viewMode', 'grid'); // ✨ 상태 저장 (새로고침/뒤로가기 대비)

        gsap.to(container, { autoAlpha: 0, duration: 0.5 });
        gsap.to(gridContainer, { autoAlpha: 1, duration: 0.5 });

        // 이름 이미지 떨어지는 애니메이션
        gsap.fromTo(".name-section img",
            { y: -400, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 2,
                ease: "bounce.out",
                stagger: 0.1,
                delay: 0.2
            }
        );

    } else {
        // [CASE 2] 닫기
        isGridView = false;
        sessionStorage.removeItem('viewMode'); // ✨ 상태 삭제

        gsap.to(gridContainer, { autoAlpha: 0, duration: 0.5 });
        gsap.to(container, { autoAlpha: 1, duration: 0.5 });
    }
});

// [버튼 2] 무조건 닫기
btnClose.addEventListener('click', () => {
    if (!isGridView) return;

    isGridView = false;
    sessionStorage.removeItem('viewMode'); // ✨ 상태 삭제

    gsap.to(gridContainer, { autoAlpha: 0, duration: 0.5 });
    gsap.to(container, { autoAlpha: 1, duration: 0.5 });
});


/* ========================================================================
   ✨ [추가됨] 링크 클릭 이벤트
   그리드 뷰 안의 캐릭터 이름을 클릭해서 이동할 때, "그리드 뷰였다"는 사실을 저장함
======================================================================== */
const gridLinks = document.querySelectorAll('.name-section a');
gridLinks.forEach(link => {
    link.addEventListener('click', () => {
        sessionStorage.setItem('viewMode', 'grid');
    });
});


/* --- 6. 메뉴 관련 코드 --- */
header.classList.add('hide');
menuTrigger.classList.add('visible');

menuTrigger.addEventListener('click', () => {
    if (header.classList.contains('hide')) {
        openMenu();
    } else {
        closeMenu();
    }
});

function openMenu() {
    header.classList.remove('hide');
    header.classList.add('active');
    menuTrigger.innerText = "menu";
    menuTrigger.style.color = "#fff";
}

function closeMenu() {
    header.classList.add('hide');
    header.classList.remove('active');
    menuTrigger.innerText = "menu";
    menuTrigger.style.color = "#fff";
}


/* --- [초기 실행] 페이지 로드 시 모니카(현재 섹션) 애니메이션 --- */
window.onload = () => {
    // ✨ [수정됨] 만약 그리드 뷰 상태로 복원된 거라면, 슬라이드 애니메이션 실행하지 않음
    if (isGridView) return; 

    // 1. 현재 보고 있는 섹션(보통 모니카, index 1)을 찾음
    const currentSection = allSections[currentIndex];
    const currentImg = currentSection.querySelector('img');

    if (currentImg) {
        let initialDelay = currentSection.classList.contains('monica') ? 1.0 : 0.3;

        gsap.fromTo(currentImg,
            { x: "30vw", opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                delay: initialDelay
            }
        );
    }
}
