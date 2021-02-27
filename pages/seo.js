import Head from "next/head"
import SEO from "../src/components/seo"

export default function seo() {
    return (
        <>
            <SEO
                description="slash url next"
                title="slash url Test"
                siteTitle="Site title"
            ></SEO>
            Hello My SEO PAge
        </>
    )
}