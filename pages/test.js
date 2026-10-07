import FurnitureCarousel from "./component/furniture";
import { getDiningTables } from "../lib/contentful"; // check this path, see below

export async function getServerSideProps() {
  const entries = await getDiningTables({ limit: 12 });
  return { props: { entries } };
}

export default function TestPage({ entries }) {
  return (
    <main>
      <FurnitureCarousel entries={entries} title="Bestsellers" />
    </main>
  );
}