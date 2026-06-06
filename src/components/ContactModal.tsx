"use client";

import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";
import { AppModal } from "@/components/AppModal";
import { contacts } from "@/data/cv";

const contactIcons = {
  phone: Phone,
  mail: Mail,
  send: Send,
  "message-circle": MessageCircle,
  "messages-square": MessageCircle,
} as const;

export function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AppModal
      isVisible={open}
      onClose={onClose}
      title="با من تماس بگیرید"
      titleId="contact-modal-title"
    >
      <p className="px-5 pt-5 text-sm leading-7 text-slate-600 dark:text-slate-400">
        در حال حاضر پاسخگوی تماس تلفنی نیستم، اما خوشحال می‌شوم پیام بدهید.
      </p>

      <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200 pb-5 dark:divide-slate-800 dark:border-slate-800">
        {contacts.map((contact) => {
          const Icon =
            contactIcons[contact.icon as keyof typeof contactIcons] ?? Mail;
          return (
            <li key={contact.href}>
              <Link
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  contact.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="flex w-full items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Icon
                    className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400"
                    strokeWidth={1.75}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {contact.label}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-primary dark:text-primary-soft">
                  {contact.value}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </AppModal>
  );
}
