import { redirect } from "next/navigation";

export default function Home() {
  // The defect list is the home screen of the app.
  redirect("/defects");
}
