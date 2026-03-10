export default function ApplicationLogo(props) {
    return (
        <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="56" height="56" rx="16" fill="currentColor" />
            <text
                x="32"
                y="38"
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill="white"
                fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
            >
                EC
            </text>
        </svg>
    );
}

