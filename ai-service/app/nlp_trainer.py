import json
import pickle
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "intent_data.json"
MODEL_PATH = BASE_DIR / "data" / "intent_pipeline.pkl"


def load_intent_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def build_pipeline() -> Pipeline:
    return Pipeline([
        ("vectorizer", TfidfVectorizer(ngram_range=(1, 2), max_features=5000)),
        ("classifier", LogisticRegression(max_iter=1000, class_weight="balanced")),
    ])


def train():
    dataset = load_intent_data()
    texts = [item["text"] for item in dataset]
    labels = [item["intent"] for item in dataset]

    use_stratify = True
    unique_labels = set(labels)
    label_counts = {label: labels.count(label) for label in unique_labels}
    if any(count < 2 for count in label_counts.values()):
        use_stratify = False
        print("Warning: not enough examples per class for stratified split. Training without stratify.")

    split_args = {
        "test_size": 0.2,
        "random_state": 42,
    }

    n_samples = len(texts)
    min_test_size = len(unique_labels)
    test_size = int(n_samples * split_args["test_size"])
    if test_size < min_test_size:
        use_stratify = False
        print(
            f"Warning: dataset too small for stratified split with {min_test_size} classes. "
            "Training without stratify."
        )

    if use_stratify:
        split_args["stratify"] = labels

    X_train, X_test, y_train, y_test = train_test_split(
        texts,
        labels,
        **split_args,
    )

    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    print("\n=== Intent classification report ===")
    print(classification_report(y_test, predictions, zero_division=0))

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(pipeline, f)

    print(f"\nSaved intent pipeline to: {MODEL_PATH}")


if __name__ == "__main__":
    train()
