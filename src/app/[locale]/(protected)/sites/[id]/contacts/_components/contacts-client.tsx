"use client";

import { ContactsTable } from "./contacts-table";

interface ContactsClientProps {
  siteId: number;
}

export function ContactsClient({ siteId }: ContactsClientProps) {
  return <ContactsTable siteId={siteId} />;
}
