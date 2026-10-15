"use client"

import { ModeToggle } from "@/components/global/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

const routes = {
  "/": {
    name: "Home",
    path: "/",
  },
  "/visualizer": {
    name: "Visualizer",
    path: "/visualizer",
  },
  "/visualizer/stack": {
    name: "Stack",
    path: "/visualizer/stack",
  },
  "/visualizer/queue": {
    name: "Queue",
    path: "/visualizer/queue",
  },
  "/visualizer/stack-applications": {
    name: "Infix to Postfix",
    path: "/visualizer/stack-applications",
  },
  "/visualizer/queue-applications": {
    name: "Message Queue",
    path: "/visualizer/queue-applications",
  },
  "/visualizer/linked-list": {
    name: "Linked List",
    path: "/visualizer/linked-list",
  },
  "/visualizer/polynomial": {
    name: "Polynomial Multiplication",
    path: "/visualizer/polynomial",
  },
  "/visualizer/binary-tree": {
    name: "Binary Tree",
    path: "/visualizer/binary-tree",
  },
  "/visualizer/avl-tree": {
    name: "AVL Tree",
    path: "/visualizer/avl-tree",
  },
  "/visualizer/heap": {
    name: "Heap",
    path: "/visualizer/heap",
  },
}

export function Breadcrumbs({
  action,
}: {
  action?: React.ReactNode
}) {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    const items = []
    let currentPath = ""

    // Home breadcrumb
    items.push(
      <BreadcrumbItem key="home">
        {segments.length === 0 ? (
          <BreadcrumbPage
            className="home-link cursor-pointer rounded-md px-2 py-1 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground"
          >
            Home
          </BreadcrumbPage>
        ) : (
          <BreadcrumbLink
            href="/"
            className="home-link cursor-pointer rounded-md px-2 py-1 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground"
          >
            Home
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    )

    // Route breadcrumbs
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`

      const route = routes[currentPath as keyof typeof routes]

      if (!route) return

      items.push(
        <BreadcrumbSeparator key={`separator-${index}`} />
      )

      if (index === segments.length - 1) {
        items.push(
          <BreadcrumbItem key={currentPath}>
            <BreadcrumbPage>{route.name}</BreadcrumbPage>
          </BreadcrumbItem>
        )
      } else {
        items.push(
          <BreadcrumbItem key={currentPath}>
            <BreadcrumbLink
              href={route.path}
              className="cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground"
            >
              {route.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      }
    })

    return items
  }

  return (
    <header className="sticky top-0 z-50 flex h-20 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 cursor-pointer text-foreground hover:text-foreground dark:text-white dark:hover:text-white" />

        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            {getBreadcrumbs()}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-4">
          {action}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}