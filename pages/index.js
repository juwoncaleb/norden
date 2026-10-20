
import { Inter } from "next/font/google";
import LandingPage from "./LandingPage";
import { getDiningTables } from "../lib/contentful";

const inter = Inter({ subsets: ["latin"] });

export async function getServerSideProps() {
  const entries = await getDiningTables({ limit: 12 });

  return {
    props: {
      entries: JSON.parse(JSON.stringify(entries)),
    },
  };
}

export default function Home({ entries }) {
  return (
    <div className="whole">
      <LandingPage entries={entries} />
    </div>
  );
}
