from model import predict_roadmap


result = predict_roadmap(
    "Beginner",
    "Beginner",
    "No Knowledge",
    "AI + Quantum Engineer"
)


print("Recommended Roadmap:")
print(result)