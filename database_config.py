# Database Configuration
# Update these values according to your MySQL setup

DB_CONFIG = {
    'host': 'localhost',           # Usually localhost
    'database': 'career_platform', # Database name
    'user': 'root',                # Your MySQL username
    'password': 'Divya@2004',      # Your MySQL password
    'port': 3306                   # Default MySQL port
}

# Test database connection
def test_connection():
    try:
        import mysql.connector
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("✅ Database connection successful!")
            connection.close()
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()
