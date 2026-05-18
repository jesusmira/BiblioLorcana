"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useNavigationGuardStore } from "@/store";
import { useDeckDraftStore } from "@/store";
import NavigationGuardModal from "@/components/ui/NavigationGuardModal";

interface NavigationGuardProviderProps {
  children: React.ReactNode;
}

export default function NavigationGuardProvider({
  children,
}: NavigationGuardProviderProps) {
  const router = useRouter();
  const { isDirty, setDirty, pendingPath, setPendingPath } =
    useNavigationGuardStore();
  const { clearDraft } = useDeckDraftStore();

  const [modalAction, setModalAction] = useState<{
    confirm: () => void;
    discard: () => void;
  } | null>(null);

  const openModal = useCallback(
    (confirm: () => void, discard: () => void) => {
      setModalAction({ confirm, discard });
      setPendingPath("pending");
    },
    [setPendingPath],
  );

  const closeModal = useCallback(() => {
    setModalAction(null);
    setPendingPath(null);
  }, [setPendingPath]);

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    history.pushState(null, "", location.href);

    const handlePopState = () => {
      history.pushState(null, "", location.href);
      openModal(
        () => {
          setDirty(false);
          router.back();
        },
        () => {
          setDirty(false);
          router.back();
        },
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty, setDirty, router, openModal]);

  useEffect(() => {
    if (!isDirty) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;
      if (link.target === "_blank") return;

      const href = link.getAttribute("href") || "";
      if (!href || href === "#" || href === "/" || href === location.pathname)
        return;
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const currentPath = location.pathname;
      if (href.startsWith(currentPath)) return;

      e.stopPropagation();
      e.preventDefault();

      openModal(
        () => {
          setDirty(false);
          router.push(href);
        },
        () => {
          clearDraft("crear");
          setDirty(false);
          router.push(href);
        },
      );
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty, setDirty, clearDraft, router, openModal]);

  const handleConfirm = useCallback(() => {
    const action = modalAction?.confirm;
    closeModal();
    if (action) action();
  }, [modalAction, closeModal]);

  const handleDiscard = useCallback(() => {
    const action = modalAction?.discard;
    closeModal();
    if (action) action();
  }, [modalAction, closeModal]);

  const handleCancel = useCallback(() => {
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    return () => {
      setDirty(false);
    };
  }, [setDirty]);

  return (
    <>
      {children}
      <NavigationGuardModal
        pendingPath={pendingPath}
        onConfirm={handleConfirm}
        onDiscard={handleDiscard}
        onCancel={handleCancel}
      />
    </>
  );
}
