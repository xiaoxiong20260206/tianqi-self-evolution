/* ============================================
   添棋自我进化机制 - JavaScript交互
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initTabNavigation();
    initMobileTips();
    initFullscreenButton();
});

/* ============ Tab导航 ============ */
function initTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.tab;
            
            // 移除所有active状态
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // 添加active状态
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // 平滑滚动到Tab导航位置
                const tabNav = document.querySelector('.tab-nav');
                if (tabNav) {
                    const offset = tabNav.offsetTop - 20;
                    window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ============ 移动端Tooltip ============ */
function initMobileTips() {
    // 检测是否为移动端
    const checkMobile = () => window.matchMedia('(max-width: 768px)').matches;
    
    // 创建遮罩层（如果不存在）
    if (!document.querySelector('.tip-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'tip-overlay';
        document.body.appendChild(overlay);
        
        // 点击遮罩关闭
        overlay.addEventListener('click', closeMobileTip);
    }
    
    // 为所有.has-tip元素绑定事件
    document.querySelectorAll('.has-tip').forEach(el => {
        const tipBox = el.querySelector('.tip-box');
        if (!tipBox) return;
        
        // 确保tip-box有关闭按钮
        if (!tipBox.querySelector('.tip-close')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'tip-close';
            closeBtn.innerHTML = '×';
            closeBtn.setAttribute('aria-label', '关闭');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMobileTip();
            });
            tipBox.appendChild(closeBtn);
        }
        
        // 点击打开（仅移动端）
        el.addEventListener('click', (e) => {
            if (!checkMobile()) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            // 关闭其他已打开的tip
            document.querySelectorAll('.has-tip.tip-active').forEach(active => {
                active.classList.remove('tip-active');
            });
            
            // 打开当前tip
            el.classList.add('tip-active');
            document.querySelector('.tip-overlay').classList.add('active');
        });
    });
    
    // 窗口大小改变时重新检测
    window.addEventListener('resize', () => {
        if (!checkMobile()) {
            closeMobileTip();
        }
    });
}

function closeMobileTip() {
    document.querySelectorAll('.has-tip.tip-active').forEach(el => {
        el.classList.remove('tip-active');
    });
    const overlay = document.querySelector('.tip-overlay');
    if (overlay) overlay.classList.remove('active');
}

/* ============ 全屏功能 ============ */
function initFullscreenButton() {
    const btn = document.getElementById('fullscreen-btn');
    if (!btn) return;
    
    btn.addEventListener('click', toggleFullscreen);
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.warn('全屏请求失败:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

/* ============ 平滑滚动 ============ */
// 为所有锚点链接添加平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ============ 卡片悬停效果增强 ============ */
// 为统计卡片添加鼠标跟随光效（可选）
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

/* ============ 滚动动画 ============ */
// 使用Intersection Observer实现滚动时的渐入动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// 为需要动画的元素添加观察
document.querySelectorAll('.section, .mechanism-card, .rule-item, .takeaway-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    animateOnScroll.observe(el);
});

// 添加动画类的样式
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

/* ============ 键盘导航支持 ============ */
document.addEventListener('keydown', (e) => {
    // ESC关闭Tooltip和全屏
    if (e.key === 'Escape') {
        closeMobileTip();
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    // 左右箭头切换Tab
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeTab = document.querySelector('.tab-btn.active');
        if (!activeTab) return;
        
        const tabs = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = tabs.indexOf(activeTab);
        
        let nextIndex;
        if (e.key === 'ArrowLeft') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        } else {
            nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        }
        
        tabs[nextIndex].click();
        tabs[nextIndex].focus();
    }
});

/* ============ 性能优化：节流函数 ============ */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 窗口滚动时更新Tab导航的阴影效果
window.addEventListener('scroll', throttle(() => {
    const tabNav = document.querySelector('.tab-nav');
    if (tabNav) {
        if (window.scrollY > 200) {
            tabNav.style.boxShadow = '0 4px 12px rgba(31, 35, 40, 0.1)';
        } else {
            tabNav.style.boxShadow = '0 2px 8px rgba(31, 35, 40, 0.06), 0 1px 2px rgba(31, 35, 40, 0.04)';
        }
    }
}, 100));

console.log('🧠 添棋自我进化机制页面已加载');
