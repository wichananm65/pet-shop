"use client";

import React, { useState } from "react";
import LoginModal from "./LoginModal";
import CarouselSpacing from "../common/Carousel";
import { useAuth } from "@/components/common/AuthProvider";


export default function HomePage() {
	const { isAuthenticated } = useAuth();
	const [showLogin, setShowLogin] = useState(false);

	return (
		<div>
			<header style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
				<div>
					<button onClick={() => setShowLogin(true)}>{isAuthenticated ? 'Account' : 'Sign in'}</button>
				</div>
			</header>

			<div className="flex justify-center items-center">
				<CarouselSpacing />
			</div>
            

			{showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
		</div>
	);
}

