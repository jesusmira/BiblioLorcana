"use server";

import { prisma } from "../lib/prisma";
import { getSession } from "../lib/auth-utils";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

export async function updatePerfil(data: { name?: string; bio?: string; avatarUrl?: string }) {
  const session = await getSession();

  if (!session?.userId) {
    return { error: "No autorizado" };
  }

  try {
    const updateData: { name?: string; bio?: string; avatarUrl?: string } = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    revalidatePath("/perfil");
    return { success: true, user: updated };
  } catch (error) {
    console.error("Error updating perfil:", error);
    return { error: "Error al actualizar el perfil" };
  }
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const session = await getSession();

  if (!session?.userId) {
    return { error: "No autorizado" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return { error: "Usuario no encontrado" };
    }

    const bcrypt = require("bcryptjs");
    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (!isValid) {
      return { error: "La contraseña actual es incorrecta" };
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Error al cambiar la contraseña" };
  }
}

export async function deleteAccount() {
  const session = await getSession();

  if (!session?.userId) {
    return { error: "No autorizado" };
  }

  try {
    await prisma.user.delete({
      where: { id: session.userId },
    });

    revalidatePath("/perfil");
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { error: "Error al eliminar la cuenta" };
  }
}
