import os
import sys
from dotenv import load_dotenv

''' 
    Run this script to check if the Langfuse library is properly installed 
    and can authenticate with the provided keys.
'''

try:
    import langfuse
    print(f"📍 Library loaded from: {langfuse.__file__}")
    from langfuse import Langfuse
except ImportError as e:
    print(f"❌ Failed to import library: {e}")
    sys.exit(1)

load_dotenv()

# Instanceiate the Langfuse client with environment variables
lf = Langfuse(
    public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
    secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
    host=os.getenv("LANGFUSE_HOST")
)

print(f"🔍 Object type: {type(lf)}")

# If the object is correct, 'auth_check' should return True if the keys are valid
try:
    is_auth = lf.auth_check()
    print(f"🔑 Authentication valid: {is_auth}")
    
    # Attempt to send using the event creation method (based on your previous dir)
    lf.create_event(name="wsl-diagnostic-test", input="ping")
    lf.flush()
    print("✅ Event sent with 'create_event'")
    
except Exception as e:
    print(f"❌ Operation failed: {e}")