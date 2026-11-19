import React from "react";

export function Footer() {
  return (
    <footer className="mt-auto pt-8 sm:pt-12 pb-4 text-center w-full text-sm text-dark-300">
      <span>Desenvolvido por </span>
      <a
        href="https://www.juniorpinhodev.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-500 hover:text-brand-400 font-bold transition-colors duration-200"
      >
        Junior Pinho | DEV
      </a>
    </footer>
  );
}
