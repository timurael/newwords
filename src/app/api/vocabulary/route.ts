import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// API route to serve vocabulary data
// This allows the app to access the vocabulary.json file

export async function GET(request: NextRequest) {
  try {
    const vocabularyPath = path.join(process.cwd(), 'src/data/vocabulary.json')
    const fileContents = await fs.readFile(vocabularyPath, 'utf8')
    const vocabulary = JSON.parse(fileContents)
    
    return NextResponse.json(vocabulary)
  } catch (error) {
    console.error('Error reading vocabulary file:', error)
    return NextResponse.json([], { status: 200 }) // Return empty array as fallback
  }
}

export async function POST(request: NextRequest) {
  try {
    const vocabulary = await request.json()
    const vocabularyPath = path.join(process.cwd(), 'src/data/vocabulary.json')
    
    await fs.writeFile(vocabularyPath, JSON.stringify(vocabulary, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error writing vocabulary file:', error)
    return NextResponse.json({ error: 'Failed to save vocabulary' }, { status: 500 })
  }
}