import Head from "next/head"
import SEO from "../src/components/seo"

export default function index() {
    return (
        <>
            <SEO
                description="Home Page next"
                title="Home Page Test"
                siteTitle="Site title"
            ></SEO>
            Hello My Next JS Index
        </>
    )
}