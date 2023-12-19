from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa

def generate_private_key(jwt_private_key_path):
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=4096,
        backend=default_backend(),
    )
    pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    )

    with open(jwt_private_key_path, 'wb') as pk:
            pk.write(pem)

    return private_key

def generate_public_key(jwt_public_key_path, private_key):
    public_key = private_key.public_key()
    pem_public = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    with open(jwt_public_key_path, 'wb') as pk:
        pk.write(pem_public)

def generate_keys(private_key_path, public_key_path):
    private_key = generate_private_key(jwt_private_key_path=private_key_path)
    generate_public_key(jwt_public_key_path=public_key_path, private_key=private_key)

    print('PRIVATE & PUBLIC KEYS GENERATED!')