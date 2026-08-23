@import "tailwindcss";

:root {
  --background: #faf9f6;
  --foreground: #1b1b18;
  --ink: #1b1b18;
  --paper: #faf9f6;
  --chili: #e34234;
  --herb: #2f6f4f;
  --muted: #8a8578;
  --line: #e4e0d8;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-ink: var(--ink);
  --color-paper: var(--paper);
  --color-chili: var(--chili);
  --color-herb: var(--herb);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --font-sans: var(--font-inter);
  --font-display: var(--font-fraunces);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}

.ticket-divider {
  background-image: radial-gradient(circle, var(--line) 1.5px, transparent 1.5px);
  background-size: 10px 2px;
  background-repeat: repeat-x;
  background-position: center;
  height: 2px;
}
