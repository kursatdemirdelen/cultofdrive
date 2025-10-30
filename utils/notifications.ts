import { supabase } from "./supabase";

type NotificationType = "favorite" | "comment" | "reply";

export async function createNotification(
  userId: string,
  type: NotificationType,
  carId: string,
  actorId: string,
  message: string
) {
  // Don't notify yourself
  if (userId === actorId) return;

  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      type,
      car_id: carId,
      actor_id: actorId,
      message,
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function notifyCarOwner(
  carId: string,
  actorId: string,
  type: NotificationType,
  message: string
) {
  try {
    // Get car owner
    const { data: car } = await supabase
      .from("cars")
      .select("user_id")
      .eq("id", carId)
      .single();

    if (car?.user_id) {
      await createNotification(car.user_id, type, carId, actorId, message);
    }
  } catch (error) {
    console.error("Failed to notify car owner:", error);
  }
}
