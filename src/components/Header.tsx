import React from "react";

export function Header() {
  return (
    <header className="w-full max-w-[840px] text-center mb-6 sm:mb-8 md:mb-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
        Meu Teclado
      </h1>
      <p className="text-sm sm:text-base text-dark-300 font-normal m-0">
        Sistema didático para treinamento de acordes, escalas e harmonia no teclado
      </p>
      <div className="text-xs sm:text-sm text-dark-300 font-semibold mt-2">
        <span>Desenvolvido por </span>
        <a
          href="https://www.juniorpinhodev.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-500 hover:text-brand-400 font-semibold transition-colors duration-200"
        >
          Junior Pinho | DEV
        </a>
      </div>
    </header>
  );
}
