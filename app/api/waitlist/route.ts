import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Configure the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// File to store waitlist submissions
const waitlistFile = path.join(process.cwd(), 'data', 'waitlist.json');

// In-memory fallback for Netlify environment
let inMemoryWaitlist: any[] = [];

// Check if we're in a read-only environment (like Netlify)
const isReadOnlyEnvironment = () => {
  // Check for Netlify environment
  return process.env.NETLIFY || process.env.CONTEXT === 'production' || process.env.NODE_ENV === 'production';
};

// Ensure the data directory exists
function ensureDirectoryExists() {
  if (isReadOnlyEnvironment()) return; // Skip in read-only environments
  
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create data directory:', error);
      // Continue execution - we'll use in-memory storage
    }
  }
}

// Load existing waitlist entries
function loadWaitlist() {
  // If we already have in-memory data and we're in a read-only environment, use that
  if (isReadOnlyEnvironment() && inMemoryWaitlist.length > 0) {
    return inMemoryWaitlist;
  }
  
  ensureDirectoryExists();
  
  if (!fs.existsSync(waitlistFile)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(waitlistFile, 'utf8');
    const parsed = JSON.parse(data);
    // Update in-memory cache
    inMemoryWaitlist = parsed;
    return parsed;
  } catch (error) {
    console.error('Error loading waitlist data:', error);
    return [];
  }
}

// Save waitlist entries
function saveWaitlist(entries: any[]) {
  // Always update in-memory storage
  inMemoryWaitlist = entries;
  
  // Skip file operations in read-only environments
  if (isReadOnlyEnvironment()) {
    console.log('In read-only environment, skipping file write');
    return;
  }
  
  ensureDirectoryExists();
  
  try {
    fs.writeFileSync(waitlistFile, JSON.stringify(entries, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving waitlist data:', error);
    // Continue execution - we've already saved to in-memory storage
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email } = body;
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Load existing entries
    const entries = loadWaitlist();
    
    // Check if email already exists
    const emailExists = entries.some((entry: any) => entry.email === email);
    if (emailExists) {
      return NextResponse.json(
        { message: 'You are already on our waitlist!' },
        { status: 200 }
      );
    }
    
    // Add new entry with timestamp
    const newEntry = {
      name,
      email,
      timestamp: new Date().toISOString()
    };
    
    entries.push(newEntry);
    
    // Save updated entries
    saveWaitlist(entries);
    
    return NextResponse.json(
      { message: 'Successfully added to waitlist' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing waitlist submission:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // This endpoint would normally be protected with authentication
  // For now, we'll just return a message
  return NextResponse.json(
    { message: 'Waitlist API is working' },
    { status: 200 }
  );
}
