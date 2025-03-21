export async function updateAdminProfile(updateData: object) {
    const token = sessionStorage.getItem("token");
  
    const response = await fetch(`/api/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
  
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("❌ Erreur Backend :", errorResponse);
      throw new Error(errorResponse.error || "Impossible de mettre à jour les informations.");
    }
  
    return await response.json();
}  

export async function updateStudentProfile(updateData: { firstName: string; lastName: string; email: string; classLevel?: string; password?: string }) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`/api/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || "Impossible de mettre à jour les informations.");
  }

  return await response.json();
}
