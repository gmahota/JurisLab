# Next.js Project Structure Migration Plan

## Current Structure Issues
- Pages are split between `/pages` and `/client/src/pages`
- Components are in `/client/src/components`
- Hooks are in `/client/src/hooks`
- Libraries are in `/client/src/lib`

## Correct Next.js Structure
- `/pages` - All pages including API routes
- `/components` - All React components 
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and libraries
- `/styles` - CSS and styling
- `/public` - Static assets

## Migration Steps
1. Move all components from `/client/src/components` to `/components`
2. Move all pages from `/client/src/pages` to `/pages`
3. Move all hooks from `/client/src/hooks` to `/hooks`
4. Move all lib files from `/client/src/lib` to `/lib`
5. Update imports across the codebase
6. Update tsconfig.json with proper path aliases
7. Test the application structure