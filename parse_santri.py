import json

data = []
with open('data_santri.txt', 'r') as f:
    lines = [line.strip() for line in f.readlines()]

# Find where data starts (after ALAMAT)
start_idx = 0
for i, line in enumerate(lines):
    if line == 'ALAMAT':
        start_idx = i + 1
        break

# Parse 5 lines per student
for i in range(start_idx, len(lines), 5):
    if i + 4 < len(lines):
        no = lines[i]
        if not no.isdigit():
            break
        nama = lines[i+1]
        nism = lines[i+2]
        jk = lines[i+3]
        alamat = lines[i+4]
        data.append({
            "no": int(no),
            "nama": nama,
            "nism": nism,
            "jk": jk,
            "alamat": alamat
        })

with open('src/data/santri.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"Parsed {len(data)} students.")
