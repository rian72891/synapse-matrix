import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore";

// 🔥 Config Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

// Mapeamento dos planos pelo product_permalink
const PLANOS = {
  "vintel-starter": "starter",
  "Vintel-pro": "pro",
  "vintel-agency": "agency",
};

export async function POST(req: Request) {
  try {
    const body = await req.formData();

    // Dados enviados pelo Gumroad
    const email = body.get("email") as string;
    const state = body.get("state") as string;
    const permalink = body.get("product_permalink") as string;

    console.log("Webhook Gumroad recebido:", { email, state, permalink });

    // Verificar se foi comprado
    if (state !== "purchased") {
      return Response.json({ ok: true });
    }

    // Identificar o plano pelo permalink
    const permalinkID = permalink.split("/").pop(); // pega o "vintel-starter", etc
    const plano = PLANOS[permalinkID!];

    if (!plano) {
      console.error("Plano não reconhecido:", permalinkID);
      return Response.json({ error: "Plano desconhecido" }, { status: 400 });
    }

    console.log("Plano identificado:", plano);

    // 🔍 Buscar usuário pelo email no Firebase
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error("Usuário não encontrado:", email);
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userRef = snapshot.docs[0].ref;

    // Atualizar usuário com o plano comprado
    await updateDoc(userRef, {
      plano: plano,
      atualizadoEm: Date.now(),
      origemPlano: "gumroad",
    });

    console.log(`Plano ${plano} liberado para:`, email);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Erro no webhook Gumroad:", err);
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
        }
