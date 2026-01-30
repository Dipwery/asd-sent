const peer = new Peer(); // একটি ইউনিক আইডি জেনারেট হবে
let conn;

// ১. নিজের আইডি ডিসপ্লে করা
peer.on('open', (id) => {
    document.getElementById('my-id').innerText = id;
});

// ২. কানেকশন রিসিভ করা (অন্য ফোন যখন কানেক্ট করবে)
peer.on('connection', (connection) => {
    conn = connection;
    setupDataHandler();
    document.getElementById('status').innerText = "স্ট্যাটাস: কানেক্টেড!";
});

// ৩. কানেক্ট বাটনে ক্লিক করে অন্যের সাথে যুক্ত হওয়া
document.getElementById('connect-btn').onclick = () => {
    const remoteId = document.getElementById('receiver-id').value;
    conn = peer.connect(remoteId);
    setupDataHandler();
    document.getElementById('status').innerText = "স্ট্যাটাস: কানেক্ট হচ্ছে...";
};

function setupDataHandler() {
    document.getElementById('transfer-section').style.display = 'block';
    
    // ডেটা রিসিভ করা
    conn.on('data', (data) => {
        if (data.file) {
            const blob = new Blob([data.file]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.fileName;
            a.innerText = "ফাইলটি ডাউনলোড করতে এখানে ক্লিক করুন: " + data.fileName;
            document.body.appendChild(a);
            document.getElementById('status').innerText = "ফাইল পাওয়া গেছে!";
        }
    });

    conn.on('open', () => {
        document.getElementById('status').innerText = "স্ট্যাটাস: কানেক্টেড!";
    });
}

// ৪. ফাইল পাঠানো
document.getElementById('send-btn').onclick = () => {
    const file = document.getElementById('file-input').files[0];
    if (file && conn && conn.open) {
        document.getElementById('status').innerText = "ফাইল পাঠানো হচ্ছে...";
        conn.send({
            file: file,
            fileName: file.name,
            fileType: file.type
        });
        alert("ফাইল পাঠানো হয়েছে!");
    } else {
        alert("প্রথমে কানেক্ট করুন এবং ফাইল সিলেক্ট করুন।");
    }
};