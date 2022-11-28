import { useEffect } from "react";
import { useAppActions } from "../store";

interface HeroType {}

const Hero = ({}: HeroType) => {
    return (<div className="flex flex-col items-center space-y-6 mt-8 mb-28">
        <h1 className="urbanist text-rainbow text-3xl font-black text-center">
            Discover tomorrow&apos;s Web3 projects, today.
        </h1>
        <p className="w-full md:w-4/6 text-center text-lg">Builda is a community of early adopters and builders showcasing Web3 projects and exchanging feedback.</p>
    </div>)
}

export default Hero;