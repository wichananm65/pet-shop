"use client";

import React, { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import CarouselSpacing from "../common/Carousel";
import { useAuth } from "@/components/common/AuthProvider";
import ShoppingMallSection from "../common/Section/ShoppingMallSection";
import RecommendedSection from "../common/Section/RecommendedSection";
import CategorySection from "../common/Section/CategorySection";


export default function HomePage() {
	useAuth();
	const [showLogin, setShowLogin] = useState(false);
	const [, setMounted] = useState(false);

	useEffect(() => {
		const id = window.setTimeout(() => setMounted(true), 0);
		return () => window.clearTimeout(id);
	}, []);

	return (
		<div>

			<div className="flex justify-center items-center mt-8">
				<CarouselSpacing />
			</div>

			<div className="flex justify-center items-center mt-8 ">
				<div className="w-2/3">
					<ShoppingMallSection />
					<CategorySection />
					<RecommendedSection />
				</div>
			</div>

			{showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
		</div>
	);
}

