import {JSXElement} from "solid-js";
import {cn} from "@/lib/utils";
import {useSidebar} from "@/hooks/useSidebar.tsx";

const SIDEBAR_WIDTH = 1
const SIDEBAR_WIDTH_ICON = 1

export interface SidebarProps {
    children: Element | JSXElement
}

interface SidebarWrapperProps {
    children: Element | JSXElement
}

function Sidebar({children}: SidebarProps) {

    const {isOpen} = useSidebar();

    return isOpen && (
        <div
            style={{
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            }}
            class={cn(
                "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
            )}
        >
            <div
                class="group peer hidden md:block text-sidebar-foreground"
            >
                <div
                    class={cn(
                        "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
                        "group-data-[collapsible=offcanvas]:w-0",
                        "group-data-[side=right]:rotate-180",
                        "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
                    )}>

                </div>
            </div>
            <div
                data-sidebar="sidebar"
                class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
            >
                {children}
            </div>
        </div>
    )
}


function SidebarHeader({ children }: SidebarWrapperProps) {
    return (
        <div data-sidebar="header" class={cn("flex", "flex-col", "gap-2", "p-2")}>
            {children}
        </div>
    )
}

function SidebarContent({ children }: SidebarWrapperProps) {
    return (
        <div
            data-sidebar="content"
            class={cn(
                "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
            )}>
            {children}
        </div>
    )
}

export {
    Sidebar,
    SidebarContent,
    SidebarHeader
}