import {createContext, createSignal, JSXElement} from "solid-js";

export interface SidebarContext {
    state: "expanded" | "collapsed";
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    toggle: () => void;
}


export const SidebarContext = createContext<SidebarContext>({
    state: "expanded",
    isOpen: true,
    setOpen: (_isOpen) => {},
    toggle: () => {},
});

export function SidebarProvider(props: { children: JSXElement }) {
    const [isOpen, setIsOpen] = createSignal(false);

    const accessor: SidebarContext = {
        get state() {
            return isOpen() ? "expanded" : "collapsed";
        },
        get isOpen() {
            return isOpen();
        },
        setOpen: setIsOpen,
        toggle() {
            setIsOpen(!isOpen());
        }
    }

    return (
        <SidebarContext.Provider value={accessor}>
            {props.children}
        </SidebarContext.Provider>
    )
}
