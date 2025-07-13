import {useContext} from "solid-js";
import {SidebarContext} from "@/context/SidebarContext.tsx";

export function useSidebar() {
    const ctx = useContext(SidebarContext);

    if (!ctx) {
        throw new Error("useSidebar context not found")
    }

    return ctx;
}

