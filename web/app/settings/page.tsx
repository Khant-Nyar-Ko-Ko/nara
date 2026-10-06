import { SiteNav } from "../site-nav";
import { EmailSettings } from "./email-settings";
export const metadata = { title: "Email settings — NaraNews" };
export default function SettingsPage() {
  return <><SiteNav /><main className="container app-content settings-page"><p className="eyebrow">YOUR ACCOUNT</p><h1>Email digest settings</h1><p>Sign in with the same email you use in the extension to manage delivery for that account.</p><EmailSettings /></main></>;
}
