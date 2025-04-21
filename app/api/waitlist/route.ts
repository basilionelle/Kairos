import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// File to store waitlist submissions
const waitlistFile = path.join(process.cwd(), 'data', 'waitlist.json');

// Ensure the data directory exists
function ensureDirectoryExists() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load existing waitlist entries
function loadWaitlist() {
  ensureDirectoryExists();
  
  if (!fs.existsSync(waitlistFile)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(waitlistFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading waitlist data:', error);
    return [];
  }
}

// Save waitlist entries
function saveWaitlist(entries: any[]) {
  ensureDirectoryExists();
  
  try {
    fs.writeFileSync(waitlistFile, JSON.stringify(entries, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving waitlist data:', error);
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
