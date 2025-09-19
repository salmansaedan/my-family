import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'تطبيق آل سعيدان'}</title>
        
        {/* CSS Libraries */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
        
        {/* Arabic Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Tailwind RTL Configuration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                fontFamily: {
                  'arabic': ['Noto Sans Arabic', 'Arial', 'sans-serif'],
                }
              }
            }
          `
        }}></script>
      </head>
      <body class="bg-gray-50 font-arabic">
        <div id="app">
          {children}
        </div>
        
        {/* JavaScript Libraries */}
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
