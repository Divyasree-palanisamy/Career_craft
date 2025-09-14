#!/usr/bin/env python3
"""
Career Platform Startup Script
This script helps you start the application with proper setup
"""

import os
import sys
import subprocess
import time

def check_python_version():
    """Check if Python version is 3.8 or higher"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_node_version():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js version: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ Node.js is not installed or not in PATH")
    print("Please install Node.js from https://nodejs.org/")
    return False

def check_mysql():
    """Check if MySQL is accessible"""
    try:
        import mysql.connector
        print("✅ MySQL connector is available")
        return True
    except ImportError:
        print("❌ MySQL connector not found")
        print("Installing mysql-connector-python...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'mysql-connector-python'])
        return True

def install_python_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Python dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install Python dependencies")
        return False

def install_node_dependencies():
    """Install Node.js dependencies"""
    print("📦 Installing Node.js dependencies...")
    try:
        subprocess.run(['npm', 'install'], check=True)
        print("✅ Node.js dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install Node.js dependencies")
        return False

def check_database_setup():
    """Check if database is set up"""
    print("🗄️  Database Setup Instructions:")
    print("1. Make sure MySQL is running")
    print("2. Create a database named 'career_platform'")
    print("3. Run the SQL script in MySQL Workbench:")
    print("   mysql -u root -p career_platform < database_schema.sql")
    print("4. Update the database credentials in app.py or create a .env file")
    print()

def start_backend():
    """Start the Flask backend"""
    print("🚀 Starting Flask backend...")
    try:
        # Start backend in a separate process
        backend_process = subprocess.Popen([sys.executable, 'app.py'])
        time.sleep(3)  # Give backend time to start
        print("✅ Backend started on http://localhost:5000")
        return backend_process
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return None

def start_frontend():
    """Start the React frontend"""
    print("🚀 Starting React frontend...")
    try:
        # Start frontend in a separate process
        frontend_process = subprocess.Popen(['npm', 'start'])
        time.sleep(5)  # Give frontend time to start
        print("✅ Frontend started on http://localhost:3000")
        return frontend_process
    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        return None

def main():
    """Main startup function"""
    print("🎯 Career Platform Startup Script")
    print("=" * 50)
    
    # Check prerequisites
    if not check_python_version():
        return
    
    if not check_node_version():
        return
    
    check_mysql()
    
    # Install dependencies
    if not install_python_dependencies():
        return
    
    if not install_node_dependencies():
        return
    
    # Database setup instructions
    check_database_setup()
    
    # Ask user if they want to start the application
    response = input("Do you want to start the application now? (y/n): ").lower().strip()
    
    if response == 'y':
        print("\n🚀 Starting Career Platform...")
        print("=" * 50)
        
        # Start backend
        backend_process = start_backend()
        if not backend_process:
            return
        
        # Start frontend
        frontend_process = start_frontend()
        if not frontend_process:
            backend_process.terminate()
            return
        
        print("\n🎉 Career Platform is running!")
        print("📱 Frontend: http://localhost:3000")
        print("🔧 Backend: http://localhost:5000")
        print("👤 Admin Login: admin / admin123")
        print("\nPress Ctrl+C to stop the application")
        
        try:
            # Wait for user to stop the application
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping application...")
            backend_process.terminate()
            frontend_process.terminate()
            print("✅ Application stopped")
    else:
        print("\n📋 Manual startup instructions:")
        print("1. Start backend: python app.py")
        print("2. Start frontend: npm start")
        print("3. Open http://localhost:3000 in your browser")

if __name__ == "__main__":
    main()
