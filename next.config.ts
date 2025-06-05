import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
import requests
import socket
import socks
import time
from stem import Signal
from stem.control import Controller

# Function to change Tor IP address
def change_tor_ip(password=""):
    """
    Changes the Tor IP address by sending a NEWNYM signal to the Tor controller.

    Args:
        password (str): The password for the Tor Control port.
    """
    try:
        # Connect to the Tor control port (default 9051)
        with Controller.from_port(port=9051) as controller:
            # Authenticate to the Tor control port
            # Use cookie authentication if configured in torrc, or password authentication
            # See https://stem.torproject.org/api/connection.html for authentication options
            if password:
                controller.authenticate(password=password)  # Authenticate using password
            else:
                controller.authenticate()  # Attempt cookie authentication (default)

            # Send the NEWNYM signal to request a new circuit (identity)
            controller.signal(Signal.NEWNYM)
            print("Tor identity changed.")
            time.sleep(5)  # Add a small delay for the new circuit to build

    except Exception as e:
        print(f"Error changing Tor identity: {e}")

# Function to set up Tor as a proxy
def setup_tor_proxy():
    """
    Sets up Tor as a SOCKS5 proxy using the socks library.
    """
    try:
        socks.set_default_proxy(socks.SOCKS5, "127.0.0.1", 9050) # Use SOCKS5 proxy on port 9050
        socket.socket = socks.socksocket  # Replace default socket with socks socket
        print("Tor proxy setup complete.")
    except Exception as e:
        print(f"Error setting up Tor proxy: {e}")

# Function to check your current IP address
def get_current_ip():
    """
    Fetches and prints the current IP address using httpbin.org/ip.
    """
    try:
        response = requests.get("http://httpbin.org/ip") # Fetch IP using requests library
        print(f"Your current IP is: {response.json()['origin']}")
    except Exception as e:
        print(f"Error fetching IP: {e}")

# Main program
if __name__ == "__main__":
    # Note: Replace "your_password" with your actual Tor Control password if using password authentication
    # If using cookie authentication (default), you can omit the password.
    tor_password = "your_password" # Replace with your password

    print("Setting up Tor proxy...")
    setup_tor_proxy()

    print("Checking current IP before changing Tor identity:")
    get_current_ip()

    print("Changing Tor identity...")
    change_tor_ip(password=tor_password) # Pass the password if needed

    print("Checking current IP after changing Tor identity:")
    get_current_ip()
