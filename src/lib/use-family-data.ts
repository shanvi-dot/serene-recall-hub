import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type FamilyData = {
  loading: boolean;
  patientId: string | null;
  patientName: string | null;
  caregiverId: string | null;
  caregiverName: string | null;
  familyId: string | null;
  error: string | null;
};

/**
 * Single source of truth for "who is logged in, what family are they in,
 * what's the patient's name, what's the caregiver's name."
 * Model: one caregiver signs up, one patient is linked to that caregiver's
 * family. No "care circle" — just this one relationship.
 */
export function useFamilyData(): FamilyData {
  const [state, setState] = useState<FamilyData>({
    loading: true,
    patientId: null,
    patientName: null,
    caregiverId: null,
    caregiverName: null,
    familyId: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No authenticated user:", userError);
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: "Not signed in." }));
        return;
      }

      const { data: caregiverRow, error: caregiverError } = await supabase
        .from("caregivers")
        .select("id, name, family_id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (caregiverError) {
        console.error("Error fetching caregiver row:", caregiverError);
      }

      if (!caregiverRow || !caregiverRow.family_id) {
        console.warn(
          "No caregiver row (with a family_id) is linked to auth user " +
            user.id +
            ". This means create_family_account() never ran successfully for this login " +
            "(most commonly: the account was created while email confirmation was still pending). " +
            "Check the caregivers table for a row with a NULL or mismatched auth_user_id."
        );
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: "No caregiver linked to this account." }));
        }
        return;
      }

      const familyId: string = caregiverRow.family_id;

      const { data: patientRow, error: patientError } = await supabase
        .from("patients")
        .select("id, name")
        .eq("family_id", familyId)
        .maybeSingle();

      if (patientError) {
        console.error("Error fetching patient row:", patientError);
      }

      if (!cancelled) {
        setState({
          loading: false,
          patientId: patientRow?.id ?? null,
          patientName: patientRow?.name ?? null,
          caregiverId: caregiverRow.id,
          caregiverName: caregiverRow.name,
          familyId,
          error: patientRow ? null : "No patient found for this family.",
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}