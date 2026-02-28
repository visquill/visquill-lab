/**
 * Package configuration
 * Defines all available packages and their settings
 */
export interface PackageConfig {
    name: string
    manifestFile: string
    folder: string
    expandByDefault: boolean
    categoryOrder: string[]
    isHome?: boolean  // If true, this package is the home screen (not shown in sidebar)
}

export const PACKAGES: PackageConfig[] = [
    {
        name: 'Home',
        manifestFile: 'home.json',
        folder: 'home',
        expandByDefault: false,
        categoryOrder: [],
        isHome: true
    },
    {
        name: 'Concepts',
        manifestFile: 'concepts.json',
        folder: 'concepts',
        expandByDefault: true,
        categoryOrder: ['Basics', 'Reactions', 'Attachments',"Geometry", 'Animations', 'Lenses', "Maps"]
    },
    {
        name: 'Blueprints',
        manifestFile: 'blueprints.json',
        folder: 'blueprints',
        expandByDefault: false,
        categoryOrder: ['Basics','Lenses', 'Utils']
    }
]
