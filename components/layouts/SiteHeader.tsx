import NavigationMenuComponent from "./NavigationMenu";
import TopHeader from "./TopHeader";

export default function SiteHeader({
  items,
  imagesRaw,
}: {
  items: any;
  imagesRaw: any;
}) {
  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <TopHeader headerData={items} />
        <NavigationMenuComponent imagesRaw={imagesRaw} headerData={items} />
    </header>
  );
}
