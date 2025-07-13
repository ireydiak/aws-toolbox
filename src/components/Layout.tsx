import {createEffect, createSignal, JSXElement} from "solid-js";
import {Sidebar, SidebarContent, SidebarHeader} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/Badge";
import {Cloud, Search, Code, Activity, MessageSquare, FileText} from "lucide-solid";
import {cn} from "@/lib/utils.ts";

interface LayoutProps {
    children: Element | JSXElement
}

const navigation = [
    {
        title: "AWS Resources",
        items: [
            {
                title: "Lambda Functions",
                url: "/lambda",
                icon: Code,
                badge: "23",
                color: "aws-lambda",
            },
            {
                title: "SQS Queues",
                url: "/sqs",
                icon: MessageSquare,
                badge: "8",
                color: "aws-sqs",
            },
            {
                title: "CloudWatch Logs",
                url: "/logs",
                icon: FileText,
                badge: "active",
                color: "aws-logs",
            },
        ],
    },
    {
        title: "Tools",
        items: [
            {
                title: "Resource Search",
                url: "/search",
                icon: Search,
                badge: null,
            },
            {
                title: "Monitoring",
                url: "/monitoring",
                icon: Activity,
                badge: null,
            },
        ],
    },
];

export function Layout({children}: LayoutProps): JSXElement {
    const [commandPaletteOpen, setCommandPaletteOpen] = createSignal(false);

    createEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === ":" && !commandPaletteOpen()) {
                event.preventDefault();
                setCommandPaletteOpen(true);
            }

            if ((event.metaKey || event.ctrlKey) && event.key === "k" && !commandPaletteOpen()) {
                event.preventDefault();
                setCommandPaletteOpen(true);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
    })

    return (
        <>
            <Sidebar>
                <SidebarHeader>
                    <div class="flex items-center gap-2 px-2 py-1">
                        <div
                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Cloud class="h-4 w-4"/>
                        </div>
                        <div class="grid flex-1 text-left text-sm leading-tight">
                            <span class="truncate font-semibold">AWS Explorer</span>
                            <span class="truncate text-xs text-muted-foreground">
                                Resource Manager
                            </span>
                        </div>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <div class="px-3 py-2">
                        <div class="relative">
                            <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <input
                                placeholder="Search resources..."
                                class="pl-8 h-9 bg-background/50 border-border/50 focus:bg-background"
                                onClick={() => setCommandPaletteOpen(true)}
                                readOnly
                            />
                            <div class="absolute right-2 top-2 text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border">
                                :
                            </div>
                        </div>
                    </div>
                    {navigation.map((group) => (
                        <div class={cn("relative flex w-full min-w-0 flex-col p-2")}>
                            <div
                                class={cn(
                                    "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
                                    "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
                                )}
                            >
                                { group.title }
                            </div>
                            <div>
                                { group.items.map((item) => (
                                    <button class="default">
                                        <a href={item.url} class="flex items-center gap-2">
                                            <item.icon class="h-4 w-4" />
                                            <span class="flex-1">{item.title}</span>
                                            { item.badge && (
                                                <Badge variant={
                                                    item.badge === "active" ? "default" : "secondary"
                                                }
                                                class={`h-5 text-xs ${
                                                    item.color === "aws-lambda"
                                                        ? "bg-aws-lambda/20 text-aws-lambda border-aws-lambda/30"
                                                        : item.color === "aws-sqs"
                                                            ? "bg-aws-sqs/20 text-aws-sqs border-aws-sqs/30"
                                                            : item.color === "aws-logs"
                                                                ? "bg-aws-logs/20 text-aws-logs border-aws-logs/30"
                                                                : ""
                                                }`}
                                                ></Badge>
                                            )}
                                        </a>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </SidebarContent>

                <p>This is the sidebar</p>
            </Sidebar>
            <main class="flex-1 overflow-hidden">
                {children}
            </main>
        </>
    )
}
