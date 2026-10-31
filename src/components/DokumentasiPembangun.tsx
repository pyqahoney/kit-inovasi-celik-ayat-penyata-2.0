import React, { useState } from 'react';
import { TopNavBar } from './OrganicNav';
import { Code, Database, Compass, Layers, Copy, Check, Terminal, Smartphone } from 'lucide-react';
import { sound } from '../utils/audio';

interface DokumentasiPembangunProps {
  onBack: () => void;
  onHome?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const DokumentasiPembangun: React.FC<DokumentasiPembangunProps> = ({
  onBack,
  onHome,
  soundEnabled,
  onToggleSound
}) => {
  const [activeTab, setActiveTab] = useState<'ui_ux' | 'schema' | 'kotlin' | 'flutter' | 'gamification'>('ui_ux');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (key: string, text: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const schemaJson = `{
  "users": {
    "STUDENT_UID_101": {
      "displayName": "Ahmad Danial bin Razak",
      "email": "danial@sekolah.edu.my",
      "role": "student",
      "classroom": "5 Bestari",
      "avatarUrl": "avatar_kancil_01.png",
      "createdAt": "2026-10-21T08:00:00Z"
    }
  },
  "pbs_records": {
    "PBS_REC_2026_101": {
      "studentId": "STUDENT_UID_101",
      "studentName": "Ahmad Danial bin Razak",
      "classroom": "5 Bestari",
      "subject": "Bahasa Melayu",
      "topic": "Ayat Perintah",
      "learningStandard": "5.3.2 Memahami dan membina ayat perintah mengikut konteks",
      "overallTP": 6,
      "computedScores": {
        "drillAccuracy": 100,
        "frogQuizScore": 5,
        "treasureQuizScore": 7,
        "totalQuizPercent": 92.5,
        "arScanCount": 4,
        "artifactsCreated": 2,
        "kancilCoins": 340
      },
      "badgesEarned": [
        "Pakar Ayat Silaan",
        "Juara Ayat Larangan",
        "Jaguh Ayat Suruhan",
        "Pakar Agung Trialogikal & Bahasa"
      ],
      "tpRubricMapping": {
        "TP1": { "achieved": true, "date": "2026-10-15" },
        "TP2": { "achieved": true, "date": "2026-10-16" },
        "TP3": { "achieved": true, "date": "2026-10-18" },
        "TP4": { "achieved": true, "date": "2026-10-19" },
        "TP5": { "achieved": true, "date": "2026-10-20" },
        "TP6": { "achieved": true, "date": "2026-10-21" }
      },
      "teacherNotes": "Menguasai kemahiran tatabahasa ayat perintah secara holistik. Mampu mencipta artifak komunikasi bermakna.",
      "lastUpdated": "2026-10-21T10:00:00Z"
    }
  },
  "trialogical_artifacts": {
    "ART_001": {
      "studentId": "STUDENT_UID_101",
      "title": "Poster Disiplin Makmal Komputer Pintar",
      "category": "poster",
      "imperativeType": "larangan",
      "primarySentence": "Jangan bawa makanan atau minuman manis ke dalam makmal.",
      "communicativeRationale": "Mengelakkan kemalangan litar pintas dan kerosakan perkakasan komputer.",
      "peerComments": ["Poster sangat jelas!", "Ayat larangan yang tepat."],
      "teacherScore": 6,
      "teacherFeedback": "Artifak autentik memenuhi prinsip pembelajaran trialogikal.",
      "publishedToGallery": true,
      "createdAt": "2026-10-21T09:30:00Z"
    }
  },
  "ar_sessions": {
    "AR_SESS_9901": {
      "studentId": "STUDENT_UID_101",
      "markerId": "KAD-01",
      "topicCategory": "silaan",
      "characterInteraction": "Si Kancil Pintar",
      "durationSeconds": 45,
      "audioPlayed": true,
      "timestamp": "2026-10-21T09:15:00Z"
    }
  }
}`;

  const kotlinCode = `// ========================================================
// 1. Android Kotlin: ARCore Augmented Images + Sceneview
//    Mengimbas Kad Fizikal dan Menampilkan Watak 3D
// ========================================================

package com.edupintar.celikperintah.ar

import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.ar.core.*
import io.github.sceneview.ar.ArSceneView
import io.github.sceneview.ar.node.ArModelNode
import com.google.firebase.firestore.FirebaseFirestore
import java.util.*

class ARPerintahActivity : AppCompatActivity(), TextToSpeech.OnInitListener {

    private lateinit var sceneView: ArSceneView
    private lateinit var tts: TextToSpeech
    private val db = FirebaseFirestore.getInstance()
    private var activeMascotNode: ArModelNode? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_ar_perintah)

        tts = TextToSpeech(this, this)
        sceneView = findViewById(R.id.arSceneView)

        // Konfigurasi ARCore Augmented Image Database
        sceneView.apply {
            configureSession { session, config ->
                config.focusMode = Config.FocusMode.AUTO
                val imageDatabase = AugmentedImageDatabase(session)

                // Muat naik marker kad imbasan daripada assets
                val kadSilaanBitmap = assets.open("markers/kad_silaan_01.jpg").use {
                    android.graphics.BitmapFactory.decodeStream(it)
                }
                imageDatabase.addImage("KAD_SILAAN", kadSilaanBitmap, 0.15f) // 15cm fizikal

                config.augmentedImageDatabase = imageDatabase
            }

            // Dengar pengesanan imej bingkai demi bingkai
            onSessionUpdated = { session, frame ->
                val updatedImages = frame.getUpdatedTrackables(AugmentedImage::class.java)
                for (image in updatedImages) {
                    if (image.trackingState == TrackingState.TRACKING) {
                        handleMarkerDetected(image)
                    }
                }
            }
        }
    }

    private fun handleMarkerDetected(image: AugmentedImage) {
        if (activeMascotNode != null) return // Watak sudah dimuatkan

        val cardName = image.name // contoh: KAD_SILAAN
        val dialog = when (cardName) {
            "KAD_SILAAN" -> "Selamat pagi kawan-kawan! Sila gunakan laluan pejalan kaki beratap ini!"
            "KAD_LARANGAN" -> "Jangan sentuh bahan kimia di atas meja ini tanpa kebenaran cikgu!"
            else -> "Tolong susun kasut kamu di rak dengan kemas."
        }

        // Paparkan model 3D (Si Kancil / Maskot GLB) di atas anchor kad
        val node = ArModelNode(sceneView.engine).apply {
            loadModelGlbAsync(
                glbFileLocation = "models/kancil_mascot.glb",
                autoAnimate = true,
                scaleToUnits = 0.25f,
                centerOrigin = null
            )
            anchor = image.createAnchor(image.centerPose)
        }

        sceneView.addChild(node)
        activeMascotNode = node

        // Mainkan sebutan Text-to-Speech Bahasa Melayu
        speakDialog(dialog)

        // Rekod sesi AR ke pangkalan data Firebase Firestore
        recordARSessionToFirestore(cardName)
    }

    private fun speakDialog(text: String) {
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "AR_VOICE")
    }

    private fun recordARSessionToFirestore(markerId: String) {
        val sessionData = hashMapOf(
            "studentId" to "STUDENT_UID_101",
            "markerId" to markerId,
            "timestamp" to com.google.firebase.Timestamp.now()
        )
        db.collection("ar_sessions").add(sessionData)
            .addOnSuccessListener {
                Toast.makeText(this, "Sesi AR direkodkan ke PBS!", Toast.LENGTH_SHORT).show()
            }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts.language = Locale("ms", "MY")
        }
    }

    override fun onDestroy() {
        tts.stop()
        tts.shutdown()
        super.onDestroy()
    }
}`;

  const flutterCode = `// ========================================================
// 2. Flutter: ARKit/ARCore + Cloud Firestore Integration
//    Logik Pengimbasan Kad AR & Auto-Kira TP PBS
// ========================================================

import 'package:flutter/material.dart';
import 'package:ar_flutter_plugin/ar_flutter_plugin.dart';
import 'package:ar_flutter_plugin/datatypes/node_types.dart';
import 'package:ar_flutter_plugin/models/ar_node.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:vector_math/vector_math_64.dart' as vector;

class ARPerintahScreen extends StatefulWidget {
  final String studentId;
  const ARPerintahScreen({Key? key, required this.studentId}) : super(key: key);

  @override
  _ARPerintahScreenState createState() => _ARPerintahScreenState();
}

class _ARPerintahScreenState extends State<ARPerintahScreen> {
  late ARSessionManager arSessionManager;
  late ARObjectManager arObjectManager;
  final FlutterTts flutterTts = FlutterTts();
  final FirebaseFirestore firestore = FirebaseFirestore.instance;

  String currentDialog = "Halakan kamera ke kad imbasan fizikal...";

  @override
  void initState() {
    super.initState();
    initTTS();
  }

  void initTTS() async {
    await flutterTts.setLanguage("ms-MY");
    await flutterTts.setSpeechRate(0.85);
    await flutterTts.setPitch(1.1);
  }

  void onARViewCreated(
    ARSessionManager sessionManager,
    ARObjectManager objectManager,
    ARAnchorManager anchorManager,
    ARLocationManager locationManager,
  ) {
    arSessionManager = sessionManager;
    arObjectManager = objectManager;

    arSessionManager.onInitialize(
      showFeaturePoints: false,
      showPlanes: true,
      customPlaneTexturePath: "assets/triangle.png",
      showWorldOrigin: false,
    );
    arObjectManager.onInitialize();
  }

  // Fungsi memuatkan model 3D watak animasi dan suara
  Future<void> triggerARCharacter(String cardType, String sentence) async {
    var newNode = ARNode(
      type: NodeType.webGLB,
      uri: "https://modelviewer.dev/shared-assets/models/Astronaut.glb", // Gantian watak Kancil
      scale: vector.Vector3(0.2, 0.2, 0.2),
      position: vector.Vector3(0.0, 0.0, -0.5),
      rotation: vector.Vector4(1.0, 0.0, 0.0, 0.0),
    );

    await arObjectManager.addNode(newNode);
    setState(() {
      currentDialog = sentence;
    });

    // Sebutan audio
    await flutterTts.speak(sentence);

    // Kemaskini rekod pangkalan data PBS
    await recordPbsActivity(cardType);
  }

  Future<void> recordPbsActivity(String cardType) async {
    final docRef = firestore.collection('pbs_records').doc(widget.studentId);

    await firestore.runTransaction((transaction) async {
      DocumentSnapshot snapshot = await transaction.get(docRef);
      if (!snapshot.exists) return;

      int currentAR = snapshot.get('computedScores.arScanCount') ?? 0;
      int quizScore = snapshot.get('computedScores.totalQuizPercent') ?? 0;
      int gameStage = snapshot.get('computedScores.treasureQuizScore') ?? 0;
      int artifacts = snapshot.get('computedScores.artifactsCreated') ?? 0;

      int newARCount = currentAR + 1;
      int newCoins = (snapshot.get('computedScores.kancilCoins') ?? 0) + 30;

      // Algoritma Auto-Kira Tahap Penguasaan (TP1 - TP6)
      int computedTP = calculateTP(quizScore, gameStage, artifacts, newARCount);

      transaction.update(docRef, {
        'computedScores.arScanCount': newARCount,
        'computedScores.kancilCoins': newCoins,
        'overallTP': computedTP,
        'lastUpdated': FieldValue.serverTimestamp(),
      });
    });
  }

  int calculateTP(int quizPercent, int gameLevel, int artifacts, int arCount) {
    if (quizPercent >= 85 && gameLevel >= 3 && artifacts >= 2 && arCount >= 2) return 6;
    if (quizPercent >= 75 && gameLevel >= 2 && artifacts >= 1) return 5;
    if (quizPercent >= 65 && gameLevel >= 2) return 4;
    if (quizPercent >= 50 && gameLevel >= 1) return 3;
    if (quizPercent >= 35 || arCount >= 1) return 2;
    return 1;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AR PdP Ayat Perintah')),
      body: Stack(
        children: [
          ARView(onARViewCreated: onARViewCreated),
          Positioned(
            bottom: 20,
            left: 20,
            right: 20,
            child: Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              color: Colors.white.withOpacity(0.95),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  currentDialog,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}`;

  return (
    <div className="relative min-h-[640px] max-w-5xl mx-auto rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl bg-slate-900 text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Navbar */}
      <TopNavBar
        onExit={onBack}
        onHome={onHome || onBack}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        title="Dokumentasi Pembangun & Arkitektur PdP"
        className="text-white"
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 my-2 border-b border-slate-700">
        {[
          { id: 'ui_ux', label: '1. Rangka Kerja UI/UX', icon: Compass },
          { id: 'schema', label: '2. Skema Firestore (JSON)', icon: Database },
          { id: 'kotlin', label: '3. Kod Asas Android (Kotlin)', icon: Terminal },
          { id: 'flutter', label: '4. Kod Asas Flutter', icon: Smartphone },
          { id: 'gamification', label: '5. Logik Gamifikasi & TP1-TP6', icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-heading font-bold text-xs whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 my-2 overflow-y-auto max-h-[460px] pr-2 text-xs leading-relaxed">
        {/* TAB 1: UI/UX Framework */}
        {activeTab === 'ui_ux' && (
          <div className="space-y-4 animate-fade-in text-slate-200">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <h3 className="font-heading font-black text-amber-400 text-base mb-2">
                Rangka Kerja Aliran UI/UX Pengguna (User Flow Architecture)
              </h3>
              <p className="text-slate-300 text-xs">
                Aplikasi ini direka bentuk mengikut fitrah psikologi kanak-kanak sekolah rendah (Tahun 3 hingga Tahun 5) yang memerlukan navigasi visual berbentuk papan tanda kayu, karakter sahabat haiwan/cikgu, maklum balas audio dwibahasa serta butang besar tanpa kekusutan (Zero-Pill discipline).
              </p>
            </div>

            {/* Tree Map */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800 border border-amber-500/30">
                <span className="font-heading font-bold text-amber-300 text-sm block mb-1">
                  A. Fasa Orientasi & Sosio-Emosi (Onboarding)
                </span>
                <ul className="space-y-1 text-slate-300">
                  <li>• <strong>Skrin 1 (Selamat Datang)</strong>: Muka hadapan bertajuk Ayat Perintah Tahun 5, maskot Cikgu Aina, butang Play Emas bulat.</li>
                  <li>• <strong>Skrin 2 (Semakan Perasaan)</strong>: "Apakah perasaan anda hari ini?" (Gembira 😊 / Sedih 😢) untuk kesediaan belajar Trialogikal.</li>
                  <li>• <strong>Skrin 3 (Makna Simbol)</strong>: Papan kayu panduan butang Keluar (X), Halaman Utama (Home), Bantuan (?), Audio dan Panah Kayu.</li>
                  <li>• <strong>Skrin 4 (Halaman Utama)</strong>: Papan tanda simpang 3 (Pengenalan, Jom Belajar, Kuiz).</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800 border border-emerald-500/30">
                <span className="font-heading font-bold text-emerald-300 text-sm block mb-1">
                  B. Fasa Pembinaan Konsep (Jom Belajar)
                </span>
                <ul className="space-y-1 text-slate-300">
                  <li>• <strong>Modul Nota</strong>: 7 kata perintah utama, formula orang pertama vs orang kedua (ibu & anak), 4 peta minda interaktif.</li>
                  <li>• <strong>Video & Teater Boneka</strong>: Video bilik darjah Cikgu Syuhada & Pentas boneka pentas bertirai merah.</li>
                  <li>• <strong>Latih Diri</strong>: 5 soalan pengukuhan kilat dengan butang pink dedah jawapan & kucing loceng comel.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800 border border-sky-500/30">
                <span className="font-heading font-bold text-sky-300 text-sm block mb-1">
                  C. Fasa Aplikasi & Gamifikasi (Kuiz & Permainan)
                </span>
                <ul className="space-y-1 text-slate-300">
                  <li>• <strong>Lompat Si Katak Lompat</strong>: 5 soalan teka daun teratai (A, B, C) di atas sungai batu jeram.</li>
                  <li>• <strong>Permainan Harta Karun</strong>: 7 soalan lanun cilik memasukkan syiling betul (✓) ke peti emas terbuka.</li>
                  <li>• <strong>Modul Augmented Reality (AR)</strong>: Pengimbasan kad imbasan fizikal dengan watak 3D bercakap.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800 border border-purple-500/30">
                <span className="font-heading font-bold text-purple-300 text-sm block mb-1">
                  D. Fasa Trialogikal & Penjejakan PBS Guru
                </span>
                <ul className="space-y-1 text-slate-300">
                  <li>• <strong>Studio Penciptaan Artifak</strong>: Murid mereka bentuk poster peraturan & kad jemputan nyata untuk mencapai TP6.</li>
                  <li>• <strong>Papan Pemuka PBS</strong>: Sistem auto-kiraan TP1-TP6, graf analisis dan butang muat turun CSV SPPB KPM.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Database Schema JSON */}
        {activeTab === 'schema' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-xs">
                Skema struktur dokumen NoSQL untuk Firebase Firestore / Google Sheets:
              </span>
              <button
                onClick={() => copyCode('schema', schemaJson)}
                className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
              >
                {copiedKey === 'schema' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedKey === 'schema' ? 'Disalin!' : 'Salin Skema JSON'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-black/80 font-mono text-emerald-400 text-[11px] overflow-x-auto border border-slate-700">
              {schemaJson}
            </pre>
          </div>
        )}

        {/* TAB 3: Android Kotlin Code */}
        {activeTab === 'kotlin' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-xs">
                Kod asas Android Kotlin menggunakan ARCore Augmented Images + Sceneview 3D:
              </span>
              <button
                onClick={() => copyCode('kotlin', kotlinCode)}
                className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
              >
                {copiedKey === 'kotlin' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedKey === 'kotlin' ? 'Disalin!' : 'Salin Kod Kotlin'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-black/80 font-mono text-amber-300 text-[11px] overflow-x-auto border border-slate-700">
              {kotlinCode}
            </pre>
          </div>
        )}

        {/* TAB 4: Flutter Code */}
        {activeTab === 'flutter' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-xs">
                Kod asas Flutter menggunakan ar_flutter_plugin & Cloud Firestore:
              </span>
              <button
                onClick={() => copyCode('flutter', flutterCode)}
                className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
              >
                {copiedKey === 'flutter' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedKey === 'flutter' ? 'Disalin!' : 'Salin Kod Flutter'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-black/80 font-mono text-sky-300 text-[11px] overflow-x-auto border border-slate-700">
              {flutterCode}
            </pre>
          </div>
        )}

        {/* TAB 5: Gamification & Rubric */}
        {activeTab === 'gamification' && (
          <div className="space-y-4 animate-fade-in text-slate-200">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <h3 className="font-heading font-black text-amber-400 text-base mb-1">
                Logik Gamifikasi & Algoritma Penentuan TP1 hingga TP6 (DSKP KSSR)
              </h3>
              <p className="text-xs text-slate-400">
                Sistem menukarkan penglibatan aktif murid secara automatik tanpa membebankan guru mengira manual:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800 border-l-4 border-emerald-500">
                <span className="font-bold text-white block">TP6 (Cemerlang & Teladan)</span>
                <p className="text-slate-400 mt-1">
                  Skor kuiz ≥ 85%, tamat kedua-dua permainan (Katak + Harta Karun), cipta ≥ 2 artifak trialogikal dan imbas ≥ 2 kad AR.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border-l-4 border-indigo-500">
                <span className="font-bold text-white block">TP5 (Sangat Baik)</span>
                <p className="text-slate-400 mt-1">
                  Skor kuiz ≥ 75%, tamat sekurang-kurangnya 1 permainan, cipta ≥ 1 artifak trialogikal.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border-l-4 border-blue-500">
                <span className="font-bold text-white block">TP4 (Baik / Menguasai)</span>
                <p className="text-slate-400 mt-1">
                  Skor kuiz ≥ 65% dan menyelesaikan soalan Latih Diri dengan tatabahasa betul tanpa kata perintah berganda.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border-l-4 border-amber-500">
                <span className="font-bold text-white block">TP3 (Memuaskan)</span>
                <p className="text-slate-400 mt-1">
                  Skor kuiz ≥ 50% dan boleh menggunakan kata perintah dalam situasi mudah.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border-l-4 border-orange-500">
                <span className="font-bold text-white block">TP2 (Tahu & Faham)</span>
                <p className="text-slate-400 mt-1">
                  Skor kuiz ≥ 35% atau telah mencuba aktiviti modul imbasan AR.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border-l-4 border-red-500">
                <span className="font-bold text-white block">TP1 (Tahap Asas)</span>
                <p className="text-slate-400 mt-1">
                  Mengenal nama kata perintah dengan bimbingan berterusan guru.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
        <span className="text-slate-400 text-xs">
          Dokumentasi Lengkap bersedia untuk pelaksanaan Android/Flutter KPM
        </span>
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-heading font-black text-xs shadow transition-all active:scale-95"
        >
          Kembali ke Aplikasi
        </button>
      </div>
    </div>
  );
};
