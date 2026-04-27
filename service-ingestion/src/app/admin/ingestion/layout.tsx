export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="th">
            <body style={{ margin: 0, padding: 0, background: '#0a0f1e' }}>
                {children}
            </body>
        </html>
    )
}