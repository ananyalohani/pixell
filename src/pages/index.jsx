import Header from "@/components/Header";
import Head from "next/head";
import Hero from "@/components/Hero";
import Container from "@/components/Container";
import Button from "@/components/Button";

export default function Home() {
  return (
    <>
      <Hero />
      <Container className="py-10">
        <section className="flex flex-col space-y-8">
          <h1 className="text-2xl">Latest Drops</h1>
          <div className="flex flex-row w-full justify-between">
            <div className="bg-pink-100 h-48 w-48"></div>
            <div className="bg-pink-100 h-48 w-48"></div>
            <div className="bg-pink-100 h-48 w-48"></div>
            <div className="bg-pink-100 h-48 w-48"></div>
            <div className="bg-pink-100 h-48 w-48"></div>
          </div>
          <Button className="self-end">Go to Marketplace</Button>
        </section>
      </Container>
    </>
  );
}
