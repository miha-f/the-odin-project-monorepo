import { useState, useRef, useEffect } from '@lynx-js/react';
import { Outlet } from 'react-router';

import './Layout.css';

function Header({ title, onPress }: { title: string, onPress: () => void }) {
    return (
        <view className="header">
            <text bindtap={onPress} style="padding-right: 4px">☰</text>
            <text>{title}</text>
        </view>
    )
}

function Sidebar({ onPress, open }: { onPress: () => void, open: boolean }) {
    const [shouldRender, setShouldRender] = useState(open);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
        } else {
            console.log("A closing...");
            const timeout = setTimeout(() => setShouldRender(false), 300);
            console.log("B closing...");
            return () => {
                console.log("clearing timeout");
                clearTimeout(timeout)
            };
        }
    }, [open]);

    if (!shouldRender) return null;

    return (
        <>
            <view className={`sidebar ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
                <view className="sidebar-header">
                    <text bindtap={onPress}>x</text>
                </view>
                <text>Home 1</text>
                <text>About</text>
            </view>
            <view
                className={`sidebar-overlay ${open ? 'overlay-show' : 'overlay-hide'}`}
                bindtap={onPress}
            />
        </>
    )
}

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // TODO(miha): We can make our custom hook here?
    // swipe to open sidebar
    const startX = useRef<number | null>(null);
    const threshold = 50;

    function handleTouchStart(e: any) {
        // Store starting X position of touch
        console.log("START");
        startX.current = e.changedTouches.pop().pageX;
        console.log("START A: ", startX.current);
    }

    function handleTouchMove(e: any) {
        if (startX.current === null) return;

        console.log("MOVE");

        // const currentX = e.touches.pageX;
        const currentX = e.changedTouches.pop().pageX;
        const dx = currentX - startX.current;

        // Swipe right from left edge to open sidebar
        if (!sidebarOpen && startX.current < 100 && dx > threshold) {
            setSidebarOpen(true);
            startX.current = null;
        }

        // Swipe left inside sidebar to close sidebar
        if (sidebarOpen && dx < -threshold) {
            setSidebarOpen(false);
            startX.current = null;
        }
    }

    function handleTouchEnd() {
        console.log("END");
        startX.current = null;
    }



    const handleMenuPress = () => {
        console.log("menu pressed");
        setSidebarOpen(true);
    };

    const handleClosePress = () => {
        console.log("sidebar closed");
        setSidebarOpen(false);
    }

    return (
        <view
            className="layout"
            bindtouchstart={handleTouchStart}
            bindtouchmove={handleTouchMove}
            bindtouchend={handleTouchEnd}
        >
            <Sidebar onPress={handleClosePress} open={sidebarOpen} />
            <view style={{ flex: 1 }}>
                <Header title="Home" onPress={handleMenuPress} />
                <scroll-view scroll-orientation="vertical" style={{ flex: 1 }}>
                    <Outlet />
                </scroll-view>
            </view>
        </view >
    )
}

