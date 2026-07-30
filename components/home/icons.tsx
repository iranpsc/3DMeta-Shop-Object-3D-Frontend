type IconProps = {
  className?: string;
};

export function SearchIcon({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        className="dark:stroke-white"
        d="M11.4582 21.7501C17.1421 21.7501 21.7498 17.1423 21.7498 11.4584C21.7498 5.77448 17.1421 1.16675 11.4582 1.16675C5.77424 1.16675 1.1665 5.77448 1.1665 11.4584C1.1665 17.1423 5.77424 21.7501 11.4582 21.7501Z"
        stroke="#000BEE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="dark:stroke-white"
        d="M22.8332 22.8334L20.6665 20.6667"
        stroke="#000BEE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIconLarge({ className }: IconProps) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        className="dark:stroke-white"
        d="M11.4582 21.7501C17.1421 21.7501 21.7498 17.1423 21.7498 11.4584C21.7498 5.77448 17.1421 1.16675 11.4582 1.16675C5.77424 1.16675 1.1665 5.77448 1.1665 11.4584C1.1665 17.1423 5.77424 21.7501 11.4582 21.7501Z"
        stroke="#000BEE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="dark:stroke-white"
        d="M22.8332 22.8334L20.6665 20.6667"
        stroke="#000BEE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type ArrowIconProps = IconProps & {
  fillClassName?: string;
};

export function ArrowLeftIcon({ className, fillClassName = "dark:fill-black" }: ArrowIconProps) {
  return (
    <svg
      width="29"
      height="22"
      viewBox="0 0 29 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        className={fillClassName}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C9.44772 0 9 0.447715 9 1C9 3.84609 7.67935 5.92053 5.97199 7.39265C4.25137 8.87621 2.17172 9.71149 0.803669 10.0192C0.791773 10.0216 0.779936 10.0242 0.768166 10.027C0.696033 10.0441 0.626926 10.0691 0.561789 10.1009C0.46092 10.1499 0.370703 10.2149 0.293615 10.292C0.193146 10.392 0.113024 10.5144 0.061842 10.6534C0.0213566 10.7627 -0.000339508 10.8799 -0.000213623 11.0001C-0.00028038 11.0787 0.0089798 11.156 0.0267162 11.2306C0.0613613 11.3774 0.128351 11.5117 0.219749 11.6255C0.330452 11.7638 0.478315 11.8735 0.652571 11.9378C0.701506 11.956 0.75202 11.9704 0.803688 11.9808C2.17174 12.2885 4.25138 13.1238 5.97199 14.6074C7.67935 16.0795 9 18.1539 9 21C9 21.5523 9.44772 22 10 22C10.5523 22 11 21.5523 11 21C11 17.4461 9.32065 14.8539 7.27801 13.0926C6.80751 12.687 6.31601 12.3235 5.81819 12H28C28.5523 12 29 11.5523 29 11C29 10.4477 28.5523 10 28 10H5.81819C6.31601 9.6765 6.80751 9.31303 7.27801 8.90735C9.32065 7.14614 11 4.55391 11 1C11 0.447715 10.5523 0 10 0Z"
        fill="#000BEE"
      />
    </svg>
  );
}
