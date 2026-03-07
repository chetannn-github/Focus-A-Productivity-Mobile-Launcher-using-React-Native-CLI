let lastTap = 0;
export const handleBackgroundTap = (ScreenLock) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300; 
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
        ScreenLock.lockDevice();
        console.log("DOUBLE TAP ")
    }
    lastTap = now;
};