"use client";

import { usePathname } from "next/navigation";
import Breadcrumb from "./Breadcrumb";

type Crumb = { label: string; href?: string };

type HeaderBreadcrumbProps = {
  // projectId → 프로젝트 이름
  projectNames: Record<string, string>;
  // `${projectId}/${taskId}` → 태스크 이름
  taskNames: Record<string, string>;
};

// URL 세그먼트를 해석해 브레드크럼을 만든다
function toCrumbs(
  pathname: string,
  { projectNames, taskNames }: HeaderBreadcrumbProps,
): Crumb[] {
  const [section, id, sub, subId] = pathname.split("/").filter(Boolean);

  if (section === "projects") {
    const crumbs: Crumb[] = [
      { label: "My Pages" },
      { label: projectNames[id] ?? id, href: `/projects/${id}` },
    ];
    if (sub === "tasks" && subId) {
      crumbs.push({ label: taskNames[`${id}/${subId}`] ?? subId });
    }
    return crumbs;
  }

  if (section === "settings") {
    const crumbs: Crumb[] = [{ label: "Settings", href: "/settings" }];
    if (id === "members") crumbs.push({ label: "Members" });
    return crumbs;
  }

  return [{ label: "Home" }];
}

export default function HeaderBreadcrumb(props: HeaderBreadcrumbProps) {
  return <Breadcrumb items={toCrumbs(usePathname(), props)} />;
}
